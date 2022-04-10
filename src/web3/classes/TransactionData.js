module.exports = class {
    constructor(data = {
        coinName: "",
        amount: 0,
        addressTo: "",
        gasFee: 0,
    }) {
        if (!data || !data.addressTo || !data.amount)
            throw "Required arguments addressTo, amount or encPrivateKey are missing"

        this.coinName = data.coinName ? data.coinName : process.env.BOT_MAIN_COIN_NAME;
        this.amount = data.amount;
        this.addressTo = data.addressTo;
        this.gasFee = data.gasFee
            ? this.coinName == process.env.BOT_MAIN_COIN_NAME
                ? data.gasFee > process.env.WEB3_GASLIMIT_MAX
                    ? process.env.WEB3_GASLIMIT_MAX
                    : data.gasFee
                : data.gasFee > process.env.WEB3_GASLIMIT_CONTRACT_MAX
                    ? process.env.WEB3_GASLIMIT_CONTRACT_MAX
                    : data.gasFee
            : this.coinName == process.env.BOT_MAIN_COIN_NAME
                ? process.env.WEB3_GASLIMIT_MIN
                : process.env.WEB3_GASLIMIT_CONTRACT_MIN;
    }
}