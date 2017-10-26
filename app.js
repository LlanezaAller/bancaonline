
// Módulos
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var swig  = require('swig');
var mongo = require('mongodb');
var gestorBD = require("./modules/gestorBD.js");
var crypto = require('crypto');
var expressSession = require('express-session');

//TODO: Reemplazar por puerto de heroku con su variable de sistema
//app.set('port', process.env.PORT || 8081);
//app.set('db','mongodb://dpiu:dpiu1234@ds125914.mlab.com:25914/bancaonline');
app.set('port', 8081);
app.set('db','mongodb://localhost:27017/bancaonline');

app.get('/', function (req, res) {
	var respuesta = swig.renderFile('views/home.html', {});
	res.send(respuesta);
})

app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

// lanzar el servidor
app.listen(app.get('port'), function() {
	console.log("Servidor activo");
})