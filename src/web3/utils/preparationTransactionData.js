const { Wallet } = require("../../db");
const { TransactionData } = require("../classes");
const checkFunds = require("./checkFunds");

module.exports = async ctx => {

    const _coinName_Arg = ctx.session.transactionData.coinName;
    const _addressTo_Arg = ctx.session.transactionData.addressTo;
    const _amount_Arg = ctx.session.transactionData.amount;

    let coinName = _coinName_Arg === process.env.BOT_MAIN_COIN_NAME ||
        _coinName_Arg in ctx.session.contracts.contract
        ? _coinName_Arg
        : undefined;

    let addressTo = (/^0x[a-fA-F0-9]{40}$/.test(_addressTo_Arg))
        ? _addressTo_Arg
        : undefined;

    let amount = parseFloat(_amount_Arg) > 0
        ? String(parseFloat(_amount_Arg))
        : undefined;

    if (!coinName) {
        await ctx.replyWithHTML(ctx.i18n.t("walletSend.unknownCoin"));
        return false
    }

    if (!amount) {
        await ctx.replyWithHTML(ctx.i18n.t("walletSend.amountIncorrect"));
        return false
    }

    if (!addressTo)
        if (/^@/.test(_addressTo_Arg)) { // Если не указан прямой адрес но есть телеграм username
            // Поиск среди кошельков
            let walletTo = await Wallet.findOne({ username: _addressTo_Arg.slice(1) });
            if (walletTo) {
                addressTo = walletTo.address;
            } else {
                await ctx.replyWithHTML(ctx.i18n.t("walletSend.usernameNotRegistered"));
                return false
            }
        } else {
            // Поиск среди сохранённых адресов
            await ctx.replyWithHTML(ctx.i18n.t("walletSend.noSavedAddresses"));
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