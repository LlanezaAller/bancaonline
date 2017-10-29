module.exports = function(app, swig, gestorBD) {

    //GET

    app.get('/account/:accountID/card/:cardID', function(req, res) {
        var criterio = { "_id": gestorBD.mongo.ObjectID(req.params.id) };

        gestorBD.obtenerCuenta(criterio, function(tarjetas) {
            if (cuentas == null) {
                res.send("Error al obtener la cuenta");
            } else {
                var respuesta = swig.renderFile('views/tarjeta.html', {
                    tarjeta: tarjetas[0]
                });
                res.send(respuesta);
            }
        });
    })

    //POST

    app.post('/account/:accountID/newCard/', app.get('cors'), function(req, res) {

        console.log("Comienza proceso de creación de tarjetas");

        createCardNumber();
        var card = {
            ownerDNI: req.session.user,
            referenceAccountIBAN: req.body.referenceAccount,
            referenceAccountID: req.params.accountID,
            cardNumber: cardNumber,
            expirationDate: req.body.expirationDate,
            status: "active",
            cash: 0,
            type: req.body.cardType,
            limit: req.body.limit
        }

        accountIBAN = undefined;
        console.log("Tarjeta:" + card.cardNumber + " DNI del dueño:" + card.ownerDNI + "\nStatus:" + card.status);
        var criterio = { "_id": gestorBD.mongo.ObjectID(req.params.id) };

        gestorBD.obtenerCuenta(criterio, function(cuentas) {
            if (cuentas == null) {
                res.send("Error al obtener la cuenta");
            } else {
                gestorBD.crearTarjeta(card, function(id) {
                    if (id == null) {
                        res.redirect("/newAccount?mensaje=Error al registrar usuario")
                    } else {
                        res.redirect("/account/" + id.ops[0].referenceAccountID + "?mensaje=Tarjeta creada");
                    }
                });
            }
        });
    });

    //Methods

    let cardNumber;

    function createCardNumber() {
        gestorBD.contartarjetas(function(result) {
            if (result == null) {
                res.redirect("/newCard?mensaje=Error al registrar usuario")
            } else {
                cardNumber = completeNumber(result);
            }
        });
    }

    function completeNumber(obj) {
        while (obj.toString().length < 16)
            obj = '0' + obj;
        return obj;
    }
}