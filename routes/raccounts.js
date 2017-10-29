module.exports = function(app, swig, gestorBD) {

    //GET
    app.get("/principal", app.get('cors'), function(req, res) {
        var criterio = { ownerDNI: req.session.user };

        gestorBD.obtenerCuentasDeUsuario(criterio, function(accounts) {
            if (accounts == null) {
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
                var respuesta = swig.renderFile('views/cuenta.html', {
                    cuenta: cuentas[0]
                });
                res.send(respuesta);
            }
        });
    })


    app.get("/account", app.get('cors'), function(req, res) {
        var respuesta = swig.renderFile('views/crearCuenta.html', {});
        res.send(respuesta);
    });

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
                res.redirect("/principal?mensaje=Nueva cuenta registrada");
            }
        });

    });

    app.post('/makeAMove', app.get('cors'), function(req, res) {

        console.log("Comienza proceso de creación de cuenta");

        var movement = {
            inputIBAN: req.body.inputIBAN,
            outputIBAN: req.body.outputIBAN,
            amount: req.body.amount
        }

        console.log("Cuenta:" + account.IBAN + " DNI del dueño:" + account.ownerDNI + "\nStatus:" + account.status);
        gestorBD.movimientoEnCuentaDadoIBAN(movement, function(id) {
            if (id == null) {
                res.redirect("/makeAMove?mensaje=Error durante la transferencia")
            } else {
                let iban = movement.inputIBAN;
                movement.inputIBAN = movement.outputIBAN;
                movement.outputIBAN = iban;
                movement.cash *= -1;
                gestorBD.movimientoEnCuentaDadoIBAN(movement, function(id) {
                    if (id == null) {
                        res.redirect("/makeAMove?mensaje=Error durante la transferencia")
                    } else {
                        res.redirect("/principal?mensaje=Transferencia completada");
                    }
                });
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

        gestorBD.contarCuentas(function(result) {
            if (result == null) {
                res.redirect("/newAccount?mensaje=Error al registrar usuario")
            } else {
                accountNumber = completeNumber(result);
            }
        });
        return country + countryCode + bankCode + codeOffice + controlDigit + accountNumber;

    }

    function completeNumber(obj) {
        while (obj.toString().length < 10)
            obj = '0' + obj;
        return obj;
    }
}