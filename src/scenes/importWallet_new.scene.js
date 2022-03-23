const WizardScene = require('telegraf/scenes/wizard')
const inputPincode = require("./sketches/inputPincode");

const { Wallet } = require("../db");

const utils = require("../utils");

module.exports = new WizardScene(
    "importWallet_new",
    async ctx => {
        try {
            ctx.session.namespace = "importWallet_new"; // Global namespace

            // Sketches session initialization
            ctx.session.inputPincode = Object();
            ctx.session.inputPincode.namespace = ctx.session.namespace; // Special namespace
            // ctx.session.inputPincode.callback = createWallet; // callback for additional features

            await ctx.replyWithHTML(ctx.i18n.t(ctx.session.namespace + ".greeting"));
            await ctx.replyWithHTML(ctx.i18n.t("inputPincode.greeting"));
            return await ctx.wizard.next();
        } catch (e) { console.log(e) }
    },
    inputPincode,
    async ctx => {
        try {
            if (ctx.message.text === "/cancel")
                await ctx.replyWithHTML(ctx.i18n.t("cancel"));
            if (/0x[A-Za-z0-9]+$/.test(ctx.message.text)) {
                ctx.session.wallet = {
                    address: await utils.privateKeyToAddress(ctx.message.text),
                    privateKey: ctx.message.text,
                    encPrivateKey: utils.cipher(ctx.message.text, ctx.session.inputPincode.pincode)
                }
            } else {
                ctx.session.wallet = await utils.walletFromMnemonic(ctx.message.text);
                ctx.session.wallet = {
                    ...ctx.session.wallet,
                    encPrivateKey: utils.cipher(ctx.session.wallet.privateKey, ctx.session.inputPincode.pincode)
                }
            }
            await ctx.deleteMessage(ctx.message.chat.chat_id, ctx.message.message_id);
            await Wallet.create({
                _id: ctx.from.id,
                username: ctx.from.username,
                address: ctx.session.wallet.address,
                encPrivateKey: ctx.session.wallet.encPrivateKey,
                lastActivityAt: Date.now(),
            });
            ctx.session.wallet = NaN
            await ctx.replyWithHTML(ctx.i18n.t(ctx.session.namespace + ".success"));
            return await ctx.scene.leave();
        } catch (e) { console.log(e) }
    }
);