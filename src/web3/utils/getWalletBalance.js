const web3 = require("../");
const weiToCoin = require("./weiToCoin");

module.exports = async ctx => {
    try {
        const balance = {}

        balance[process.env.BOT_MAIN_COIN_NAME] = {
            symbol: process.env.BOT_MAIN_COIN_SYMBOL,
            value: weiToCoin(await web3.eth.getBalance(ctx.session.wallet.address))
        }

        for (contractName in ctx.session.contracts.contract) {
            const contract = ctx.session.contracts.contract[contractName];
            balance[contractName] = {
                value: weiToCoin(await (new web3.eth.Contract(
                    JSON.parse(ctx.session.contracts.abi[contract.abi]),
                    contract.address
                )).methods.balanceOf(ctx.session.wallet.address).call()),
                symbol: contract.symbol,
            }
        }

        return balance
    } catch (e) { console.log("[ERROR] getWalletBalance:\n" + e) }
}