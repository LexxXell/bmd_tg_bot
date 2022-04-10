const { Composer } = require("telegraf");
const web3utils = require("../web3/utils");
const { TransactionData } = require("../web3/classes");

const composer = new Composer();

composer.command("walletSend", async ctx => {
    try {
        const commandArgs = ctx.message.text.replace(/\s+/g, ' ').trim().split(" ")

        let addressTo,
            amount,
            coinName

        switch (commandArgs.length) {
            case 1:
                await ctx.reply("Вызов сцены мастера отправки коинов");
                break;
            case 3:
                // Отправка основного коина
                coinName = process.env.BOT_MAIN_COIN_NAME;
                addressTo = commandArgs[1]
                amount = commandArgs[2]
                break;
            case 4:
                // Отправка любого коина
                coinName = commandArgs[1]
                addressTo = commandArgs[2]
                amount = commandArgs[3]
                break;
            default:
                return await ctx.replyWithHTML(ctx.i18n.t("walletSend.wrongCommandCall"));
        }

        ctx.session.transactionData = {
            addressTo,
            coinName,
            amount,
        };

        if (await web3utils.preparationTransactionData(ctx))
            return await ctx.scene.enter("confirmTransaction");
        return await ctx.replyWithHTML(ctx.i18n.t("walletSend.transactionError"));
        
    } catch (e) { console.log("[ERROR] walletSend \n" + e) }
});

module.exports = composer