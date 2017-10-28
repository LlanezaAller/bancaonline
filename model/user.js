let account = require("./account");

module.exports = class User {
    constructor(id, name, surname, dni, phone, street, gate, floor, email, password) {
        //this.id = id; lo crea mongo solo
        this.name = name;
        this.surname = surname;
        this.dni = dni;
        this.phone = phone;
        this.street = street;
        this.gate = gate;
        this.floor = floor;
        this.email = email;
        this.password = password;
        this.accounts = [];
        //this.cards = []; //Probamos con tarjetas dentro de cuentas
    }


}