let account = require("./account");

module.exports = class User{
    constructor(id, name, surname, dni, phone, address, email){
        //this.id = id; lo crea mongo solo
        this.name = name;
        this.surname = surname;
        this.dni = dni;
        this.phone = phone;
        this.address = address;
        this.email = email;
        this.accounts = [];
        //this.cards = []; //Probamos con tarjetas dentro de cuentas
    }


}