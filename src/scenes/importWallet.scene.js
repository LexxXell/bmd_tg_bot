const WizardScene = require('telegraf/scenes/wizard')

const { Wallet } = require("../db");

const utils = require("../utils");














// ДОБАВИТЬ В НАЧАЛО СОДАНИЕ ПИН-КОДА!!!!!






module.exports = new WizardScene(
    "importWallet",
    async ctx => {
        try {
            switch (ctx.message.text) {
                case ("/mnemonic"):
                    ctx.session.importWallet = "mnemonic";
                    await ctx.replyWithHTML("Пришли мне мнемоническую фразу");
                    return ctx.wizard.next();
                case ("/privateKey"):
                    ctx.session.importWallet = "privateKey";
                    await ctx.replyWithHTML("Пришли мне приватный ключ");
                    return ctx.wizard.next();
                default:
                    if (!ctx.session.importWallet || ctx.session.importWallet === "") {
                        await ctx.replyWithHTML("Импортировать кошелёк можно прислав мне мнемоническую фразу или приватный ключ");
                        await ctx.replyWithHTML("/privateKey приватный ключ");
                        await ctx.replyWithHTML("/mnemonic мнемоническая фраза");
                    }
                    return
            }
        } catch (e) { console.log(e) }
    },
    async ctx => {
        try {
            await ctx.deleteMessage(ctx.message.chat.chat_id, ctx.message.message_id);
            var wallet = {}
            switch (ctx.session.importWallet) {
                case ("mnemonic"):
                    try {
                        wallet = await utils.walletFromMnemonic(ctx.message.text);
                    } catch { wallet = false }
                    if (!wallet) return await ctx.replyWithHTML("Мнемоническая фраза не подходит. Пришли повторно.");
                    break;
                case ("privateKey"):
                    var address = ""
                    try {
                        address = await utils.privateKeyToAddress(ctx.message.text);
                    } catch { address = false }
                    if (!address) return await ctx.replyWithHTML("Приватный ключ не подходит. Пришли повторно.");
                    wallet = {
                        address: address,
                        privateKey: ctx.message.text
                    }
                    break;
            }
            ctx.session.importWallet = "";
            await Wallet.create({
                _id: ctx.from.id,
                username: ctx.from.username,
                address: wallet.address,
                encPrivateKey: wallet.encPrivateKey,
                lastActivityAt: Date.now(),
            });
            await ctx.replyWithHTML("Кошелёк успешно импортирован");
            return ctx.scene.leave();
        } catch (e) { console.log(e) }
    }
);

