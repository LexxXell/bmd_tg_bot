const WizardScene = require('telegraf/scenes/wizard')

const { Wallet } = require("../db");

const utils = require("../utils");

module.exports = new WizardScene(
    "createWallet",
    async ctx => {
        try {
            await ctx.replyWithHTML(ctx.i18n.t("walletCreation.letCreateWallet"));
            await ctx.replyWithHTML(ctx.i18n.t("walletCreation.setPinCode"));
            await ctx.replyWithHTML(ctx.i18n.t("walletCreation.sendMePincode"));
            return ctx.wizard.next();
        } catch (e) { console.log(e) }
    },
    async ctx => {
        try {
            if (ctx.message.text === "/cancel") {
                await ctx.replyWithHTML(ctx.i18n.t("walletCreation.cancel"));
                return ctx.scene.leave();
            }
            await ctx.deleteMessage(ctx.message.chat.chat_id, ctx.message.message_id)
            if (/^\d{4}$/.test(ctx.message.text)) {
                // Тут создаём кошелёк
                const pincode = ctx.message.text;
                const ethWallet = await utils.generateWallet();
                const encPrivateKey = utils.cipher(ethWallet.privateKey, pincode)
                // Проверка на сбой при шифровке (практически невероятно, но всё же)
                if (ethWallet.privateKey !== utils.decipher(encPrivateKey, pincode))
                    return ctx.replyWithHTML(ctx.i18n.t("walletCreation.badPincode"));
                await ctx.replyWithHTML(ctx.i18n.t("walletCreation.pincodeSusess"));
                ctx.session.address = ethWallet.address;
                ctx.session.encPrivateKey = encPrivateKey;
                ctx.session.addressMessage = await ctx.replyWithHTML(ctx.i18n.t("walletCreation.infoAddress", { ethWallet }));
                ctx.session.secretMessage = await ctx.replyWithHTML(ctx.i18n.t("walletCreation.infoPrivateKey", { ethWallet }));
                ethWallet.privateKey = "0x00";
                await ctx.replyWithHTML(ctx.i18n.t("walletCreation.disclaimer"));
                await ctx.replyWithHTML(ctx.i18n.t("walletCreation.agree_disagree"));
                return ctx.wizard.next();
            }
        } catch (e) { console.log(e) }
    },
    async ctx => {
        try {
            switch (ctx.message.text) {
                case ("/Agree"):
                    await Wallet.create({
                        _id: ctx.from.id,
                        username: ctx.from.username,
                        address: ctx.session.address,
                        encPrivateKey: ctx.session.encPrivateKey,
                        lastActivityAt: Date.now(),
                    });
                    await ctx.replyWithHTML(ctx.i18n.t("walletCreation.wallewWasCreated"));
                    break;
                case ("/Disagree"):
                case ("/cancel"):
                    await ctx.telegram.deleteMessage(ctx.session.addressMessage.chat.id, ctx.session.addressMessage.message_id);
                    await ctx.replyWithHTML(ctx.i18n.t("walletCreation.cancel"));
                    break;
                default:
                    return await ctx.replyWithHTML(ctx.i18n.t("walletCreation.agree_disagree"));
            }
            await ctx.telegram.deleteMessage(ctx.session.secretMessage.chat.id, ctx.session.secretMessage.message_id);
            return ctx.scene.leave();
        } catch (e) { console.log(e) }
    }
);