const web3 = require("../");
const weiToCoin = require("./weiToCoin");

module.exports = async ctx => {
    try {
        const balance = {}

        balance[process.env.BOT_MAIN_COIN_NAME] = {
            symbol: process.env.BOT_MAIN_COIN_SYMBOL,
            value: weiToCoin(await web3.eth.getBalance(ctx.wallet.address))
        }

        for (i = 0; i < ctx.contracts.contract.length; i++) {
            balance[ctx.contracts.contract[i].name] = {
                value: weiToCoin(await (new web3.eth.Contract(
                    JSON.parse(ctx.contracts.abi[ctx.contracts.contract[i].abi]),
                    ctx.contracts.contract[i].address
                )).methods.balanceOf(ctx.wallet.address).call()),
                symbol: ctx.contracts.contract[i].symbol
            }
        }

        return balance
    } catch (e) { console.log("[ERROR] getWalletBalance:\n" + e) }
}