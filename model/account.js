let card = require("./card");

module.exports = class Accounts {
    //STATUSAVAILABLE =["alta", "baja"];

    constructor(IBAN, cash, type, status, limit) {
        this.IBAN = IBAN;
        this.cash = cash;
        this.type = type;
        this.status = status;
        this.limit = limit;
        this.moves = [];
    }

}