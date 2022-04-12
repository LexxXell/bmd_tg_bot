const { Wallet } = require("../../db");

module.exports = async (ctx, address = String()) => {
    if (/^0x[a-fA-F0-9]{40}$/.test(address))
        return address
    if (/^@/.test(address)) { // Если не указан прямой адрес но есть телеграм username
        // Поиск среди кошельков
        let wallet = await Wallet.findOne({ username: address.slice(1) });
        if (!wallet) {
            await ctx.replyWithHTML(ctx.i18n.t("preparationAddress.usernameNotRegistered"));
            return false
        }
        return wallet.address;
    }
    // Поиск среди сохранённых адресов
    await ctx.replyWithHTML(ctx.i18n.t("preparationAddress.noSavedAddresses"));
    return false
}