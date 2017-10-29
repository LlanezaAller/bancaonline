module.exports = class Cards {
    //CARDTYPES = ["credito", "debito", "monedero"];
    //STATUSAVAILABLE =["alta", "baja", "suspendida"];

    constructor(ownerDNI, referenceAccount, cardNumber, status, cash, type, limit) {
        //cash si el type == monedero
        this.ownerDNI = ownerDNI;
        this.referenceAccountIBAN = referenceAccountIBAN;
        this.referenceAccountID = referenceAccountID;
        this.cardNumber = cardNumber;
        this.status = status;
        this.cash = cash;
        this.type = type;
        this.limit = limit;
    }


}