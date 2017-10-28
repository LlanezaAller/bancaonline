module.exports = function(app, swig, gestorBD) {

    //GET
    app.get("/principal", app.get('cors'), function(req, res) {
        var criterio = { ownerDNI: req.session.user };

        gestorBD.obtenerCanciones(criterio, function(accounts) {
            if (canciones == null) {
                res.send("Error al listar ");
            } else {
                var respuesta = swig.renderFile('views/principal.html', {
                    accounts: accounts
                });
                res.send(respuesta);
            }
        });
    });

    app.get('/cuenta/:id', function(req, res) {
        var criterio = { "_id": gestorBD.mongo.ObjectID(req.params.id) };

        gestorBD.obtenerCuenta(criterio, function(cuentas) {
            if (canciones == null) {
                res.send(respuesta);
            } else {
                var respuesta = swig.renderFile('views/bcancion.html', {
                    cuenta: cuentas[0]
                });
                res.send(respuesta);
            }
        });
    })

    //POST
    app.post('/account', app.get('cors'), function(req, res) {

        console.log("Comienza proceso de creación de cuenta");

        var account = {
            ownerDNI: req.session.user,
            IBAN: createIBAN(),
            cash: 0,
            accountType: req.body.accountType,
            limit: req.body.limit,
            status: "active",
            moves: []
        }

        console.log("Cuenta:" + account.IBAN + " DNI del dueño:" + account.ownerDNI + "\nStatus:" + account.status);
        gestorBD.crearCuenta(account, function(id) {
            if (id == null) {
                res.redirect("/newAccount?mensaje=Error al registrar usuario")
            } else {
                res.redirect("/principal?mensaje=Nuevo usuario registrado");
            }
        });

    });

    //METHODS
    function createIBAN() {
        let country = "ES";
        let countryCode = 98;
        let bankCode = 6179;
        let codeOffice = 7777;
        let controlDigit = 99;
        let accountNumber;

        gestorBD.contarCuentas(function() {
            if (result == null) {
                res.redirect("/newAccount?mensaje=Error al registrar usuario")
            } else {
                accountNumber = completeNumber(result);
            }
        });
        return country + countryCode + bankCode + codeOffice + controlDigit + accountNumber;

    }

    function completeNumber(obj) {
        while (obj.value.length < 10)
            obj.value = '0' + obj.value;
    }
}