module.exports = (ctx, numbered = Boolean(), coinPrefix = String()) => {
    try {
        let count = 1;
        let coinList = (numbered ? count + ": " : "") + coinPrefix + process.env.BOT_MAIN_COIN_NAME + " - " + process.env.BOT_MAIN_COIN_SYMBOL;
        for (coinName in ctx.session.contracts.contract) {
            count++;
            coinList += " \n" + (numbered ? count + ": " : "") + coinPrefix + coinName + " - " + ctx.session.contracts.contract[coinName].symbol;
        }
        return coinList
    } catch (e) {
        console.log("[ERROR] Get Coin List\n" + e)
    }
}