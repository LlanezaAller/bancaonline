module.exports = function(app, swig, gestorBD) {

    var ExpressBrute = require('express-brute');
    var MongoStore = require('express-brute-mongo');
    var MongoClient = require('mongodb').MongoClient;

    var store = new MongoStore(function(ready) {
        MongoClient.connect(app.get('db'), function(err, db) {
            if (err) throw err;
            ready(db.collection('bruteforce-store'));
        });
    });

    var bruteforce = new ExpressBrute(store);
    // incluir "app.post('/...', bruteforce.prevent, function(req, res, nect) { ... }); cuando se quiera usar"

    //GET

    app.get("/registrarse", app.get('cors'), function(req, res) {
        var respuesta = swig.renderFile('views/registrarse.html', {});
        res.send(respuesta);
    });

    app.get("/identificarse", app.get('cors'), function(req, res) {
        var respuesta = swig.renderFile('views/identificarse.html', {});
        res.send(respuesta);
    });


    app.get("/principal", app.get('cors'), function(req, res) {
        var respuesta = swig.renderFile('views/principal.html', {});
        res.send(respuesta);
    });

    //POST

    app.post("/identificarse", bruteforce.prevent, function(req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.pwd).digest('hex');

        var criterio = {
            dni: req.body.dni,
            password: seguro
        }

        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.redirect("/identificarse" +
                    "?mensaje=Email o password incorrecto" +
                    "&tipoMensaje=alert-danger ");
            } else {
                req.session.usuario = usuarios[0].dni;
                res.redirect("/principal");
            }

        });

    });

    app.post('/registrarse', app.get('cors'), function(req, res) {

        if (req.body.pwd1 != req.body.pwd2) {
            console.log("Contraseñas no coinciden");
            res.redirect("/registrarse?mensaje=Error al crear el usuario, cambios invalidos")
        } else {
            console.log("Comienza proceso de registro");
            var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                .update(req.body.pwd1).digest('hex');

            var usuario = {
                name: req.body.name[0],
                surname: req.body.name[1],
                dni: req.body.dni,
                phone: req.body.phone,
                street: req.body.street,
                gate: req.body.gate,
                floor: req.body.floor,
                email: req.body.email,
                password: seguro,
                accounts: []
            }

            console.log("Usuario:" + usuario.name + " " + usuario.surname + "\nPassword:" + req.body.password);
            gestorBD.insertarUsuario(usuario, function(id) {
                if (id == null) {
                    res.redirect("/registrarse?mensaje=Error al registrar usuario")
                } else {
                    res.redirect("/identificarse?mensaje=Nuevo usuario registrado");
                }
            });
        }
    });
}