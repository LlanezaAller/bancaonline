module.exports = function(app, swig, gestorBD) {
    var asserts = require("./asserts");

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

    app.get('/account/:id', function(req, res) {
        var criterio = { "_id": gestorBD.mongo.ObjectID(req.params.id) };

        gestorBD.obtenerCuenta(criterio, function(cuentas) {
            if (cuentas == null) {
                res.send("Error al obtener la cuenta");
            } else {
                var criterio = { "referenceAccountID": cuentas[0]._id };
                gestorBD.obtenerTarjetas(criterio, cuentas[0], function(tupla) {

                    var respuesta = swig.renderFile('views/cuenta.html', {
                        cuenta: tupla.cuenta,
                        tarjetas: tupla.tarjeta
                    });

                    res.send(respuesta);
                });
            }
        });
    })

    app.get('/account/:id/makeAMove', function(req, res) {
        var criterio = { "_id": gestorBD.mongo.ObjectID(req.params.id) };

        gestorBD.obtenerCuenta(criterio, function(cuentas) {
            if (cuentas == null) {
                res.send("Error al obtener la cuenta");
            } else {
                var respuesta = swig.renderFile('views/movimiento.html', {
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

        createIBAN(function(result) {
            if (result == null) {
                res.redirect("/newAccount?mensaje=Error en los campos")
            } else {
                var account = {
                    ownerDNI: req.session.user,
                    IBAN: result,
                    cash: 0,
                    accountType: req.body.accountType,
                    limit: req.body.limit,
                    status: "active",
                    moves: []
                }

                if (!asserts.assertPropertiesAreNullOrEmpty(account, "limit", "cash", "moves"))
                    res.redirect("/newAccount?mensaje=Error en los campos")
                else {
                    accountIBAN = undefined;
                    console.log("Cuenta:" + account.IBAN + " DNI del dueño:" + account.ownerDNI + "\nStatus:" + account.status);
                    gestorBD.crearCuenta(account, function(id) {
                        if (id == null) {
                            res.redirect("/newAccount?mensaje=Error al registrar una cuenta");
                        } else {
                            res.redirect("/principal?mensaje=Nueva cuenta registrada");
                        }
                    });
                }
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

        if (!asserts.assertPropertiesAreNullOrEmpty(movement))
            res.redirect("/makeAMove?mensaje=Datos de transferencia erróneos")

        var criterio = { "IBAN": movement.inputIBAN };

        gestorBD.movimientoEnCuentaDadoIBAN(movement, function(id) {
            if (id == null) {
                res.redirect("/makeAMove?mensaje=Datos de transferencia erróneos");
            } else {
                let iban = movement.inputIBAN;
                movement.inputIBAN = movement.outputIBAN;
                movement.outputIBAN = iban;
                movement.cash *= -1;
                gestorBD.movimientoEnCuentaDadoIBAN(movement, function(id) {
                    if (id == null) {
                        res.redirect("/principal?mensaje=Transferencia completada");
                    } else {
                        res.redirect("/account/" + id.ops[0]._id + "?mensaje=Transferencia completada");
                    }
                });
            }
        });
    });

    //METHODS

    function createIBAN(functionCallback) {
        let country = "ES";
        let countryCode = 98;
        let bankCode = 6179;
        let codeOffice = 7777;
        let controlDigit = 99;
        let accountNumber;
        gestorBD.contarCuentas(function(result) {
            if (result == null) {
                res.redirect("/newAccount?mensaje=Error al crear tarjetas");
            } else {
                accountNumber = completeNumber(result);
                accountIBAN = country + countryCode + bankCode + codeOffice + controlDigit + accountNumber;
                functionCallback(accountIBAN);
            }
        });
    }

    function completeNumber(obj) {
        while (obj.toString().length < 10)
            obj = '0' + obj;
        return obj;
    }
}