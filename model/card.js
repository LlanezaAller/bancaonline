module.exports = class Cards{
    //CARDTYPES = ["credito", "debito", "monedero"];
    //STATUSAVAILABLE =["alta", "baja", "suspendida"];
    
    constructor (cardNumber, status, cash, type){
        //cash si el type == monedero
        this.cardNumber = cardNumber;
        this.status = status;
        this.cash = cash;
        this.type = type;
    }

    
}