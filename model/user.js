let account = require("./account");

module.exports = class User{
    constructor(id, name, surname, dni, phone, email){
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.dni = dni;
        this.phone = phone;
        this.email = email;
        this.accounts = [];
        //this.cards = []; //Probamos con tarjetas dentro de cuentas
    }


}