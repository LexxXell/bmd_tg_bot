const { Wallet } = require("../../db");
const { TransactionData } = require("../classes");
const checkFunds = require("./checkFunds");
const preparationAddress = require("./preparationAddress");

module.exports = async ctx => {

    const _coinName_Arg = ctx.session.transactionData.coinName;
    const _addressTo_Arg = ctx.session.transactionData.addressTo;
    const _amount_Arg = ctx.session.transactionData.amount;

    let coinName = _coinName_Arg === process.env.BOT_MAIN_COIN_NAME ||
        _coinName_Arg in ctx.session.contracts.contract
        ? _coinName_Arg
        : undefined;


    let addressTo = await preparationAddress(ctx, _addressTo_Arg);
    if (!addressTo) return false

    let amount = Math.abs(parseFloat(_amount_Arg))
    amount = amount > 0
        ? String(amount)
        : undefined;

    if (!coinName) {
        await ctx.replyWithHTML(ctx.i18n.t("walletSend.unknownCoin"));
        return false
    }

    if (!amount) {
        await ctx.replyWithHTML(ctx.i18n.t("walletSend.amountIncorrect"));
        return false
    }
    if (!addressTo) {
        await ctx.replyWithHTML(ctx.i18n.t("walletSend.transactionNotPossibleNoRecipient"));
        return false
    }

    ctx.session.transactionData = new TransactionData({
        coinName,
        addressTo,
        amount,
    })

    // Если не хватает средств на транзакцию
    if (!await checkFunds(ctx)) {
        await ctx.replyWithHTML(ctx.i18n.t("walletSend.insufficientFunds"));
        return false
    }

    return true
}