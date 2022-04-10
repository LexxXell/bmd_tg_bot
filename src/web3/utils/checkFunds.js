const web3 = require("../");

module.exports = async ctx => {
    try {
        if (!ctx.session || !ctx.session.transactionData || !ctx.session.transactionData.amount)
            return  false;

        ctx.session.transactionData.coinName = ctx.session.transactionData.coinName
            ? ctx.session.transactionData.coinName === process.env.BOT_MAIN_COIN_NAME
                ? process.env.BOT_MAIN_COIN_NAME
                : ctx.session.transactionData.coinName in ctx.session.contracts.contract
                    ? ctx.session.transactionData.coinName
                    : undefined
            : process.env.BOT_MAIN_COIN_NAME;

        if (!ctx.session.transactionData.coinName) return  false;

        if (ctx.session.transactionData.coinName ===
            process.env.BOT_MAIN_COIN_NAME) {

            // If Main Coin
            return (BigInt(web3.utils.toWei(String(ctx.session.transactionData.amount), "ether")) +
                BigInt(web3.utils.toWei(String(ctx.session.transactionData.gasFee
                    ? ctx.session.transactionData.gasFee > process.env.WEB3_GASLIMIT_MAX
                        ? process.env.WEB3_GASLIMIT_MAX
                        : ctx.session.transactionData.gasFee
                    : process.env.WEB3_GASLIMIT_MIN),
                    process.env.WEB3_GAS_UNIT
                ))) < BigInt(await web3.eth.getBalance(ctx.session.wallet.address));

        } else {

            // If Contract Coin
            return BigInt(web3.utils.toWei(String(ctx.session.transactionData.gasFee
                ? ctx.session.transactionData.gasFee > process.env.WEB3_GASLIMIT_CONTRACT_MAX
                    ? process.env.WEB3_GASLIMIT_CONTRACT_MAX
                    : ctx.session.transactionData.gasFee
                : process.env.WEB3_GASLIMIT_CONTRACT_MIN),
                process.env.WEB3_GAS_UNIT
            )) < BigInt(await web3.eth.getBalance(ctx.session.wallet.address)) &&
                BigInt(web3.utils.toWei(String(ctx.session.transactionData.amount), "ether")) <
                BigInt(await (new web3.eth.Contract(
                    JSON.parse(ctx.session.contracts.abi[ctx.session.contracts.contract[ctx.session.transactionData.coinName].abi]),
                    ctx.session.contracts.contract[ctx.session.transactionData.coinName].address
                )).methods.balanceOf(ctx.session.wallet.address).call());

        }
    } catch (e) { console.log("[ERROR] checkFunds:\n" + e) }
}