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

    app.get('/account/:accountID/newCard', app.get('cors'), function(req, res) {
        var respuesta = swig.renderFile('views/crearTarjeta.html', {});
        res.send(respuesta);
    });

    //POST

    app.post('/account/:accountID/newCard', app.get('cors'), function(req, res) {

        console.log("Comienza proceso de creación de tarjetas");

        createCardNumber(function(result) {

            var card = {
                ownerDNI: req.session.user,
                referenceAccountIBAN: req.body.referenceAccount,
                referenceAccountID: req.params.accountID,
                cardNumber: result,
                expirationDate: req.body.expirationDate,
                status: "activa",
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

    });

    //Methods


    function createCardNumber() {
        gestorBD.contarTarjetass(function(result) {
            if (result == null) {
                res.redirect("/newAccount?mensaje=Error al crear tarjetas");
            } else {
                functionCallback(completeNumber(result));
            }
        });
    }

    function completeNumber(obj) {
        while (obj.toString().length < 16)
            obj = '0' + obj;
        return obj;
    }
}