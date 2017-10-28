module.exports = function(app, swig, gestorBD) {

    var ExpressBrute = require('express-brute');
    var MongoStore = require('express-brute-mongo');

    var store = new MongoStore(function(ready) {
        MongoClient.connect(app.get('db'), function(err, db) {
            if (err) throw err;
            ready(db.collection('bruteforce-store'));
        });
    });

    var bruteforce = new ExpressBrute(store);
    // incluir "app.post('/...', bruteforce.prevent, function(req, res, nect) { ... }); cuando se quiera usar"

    app.get("/registrarse", function(req, res) {
        var respuesta = swig.renderFile('views/registro.html', {});
        res.send(respuesta);
    });

    app.get("/identificarse", function(req, res) {
        var respuesta = swig.renderFile('views/identificarse.html', {});
        res.send(respuesta);
    });
}