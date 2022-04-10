const WizardScene = require('telegraf/scenes/wizard')
const inputPincode = require("./sketches/inputPincode");

const { Wallet } = require("../db");

const utils = require("../utils");
const web3utils = require("../web3/utils");

module.exports = new WizardScene(
    "importWallet",
    async ctx => {
        try {
            ctx.session.namespace = "importWallet"; // Global namespace

            // Sketches session initialization
            ctx.session.inputPincode = Object();
            ctx.session.inputPincode.namespace = ctx.session.namespace; // Special namespace

            await ctx.replyWithHTML(ctx.i18n.t(ctx.session.namespace + ".greeting"));
            await ctx.replyWithHTML(ctx.i18n.t("inputPincode.greeting"));
            return await ctx.wizard.next();
        } catch (e) { console.log(e) }
    },
    inputPincode,
    async ctx => {
        try {
            if (ctx.message.text === "/cancel") {
                await ctx.replyWithHTML(ctx.i18n.t("cancel"));
                return await ctx.scene.leave();
            }
            const message = ctx.message.text.replace(/\s+/g, ' ').trim()
            if (/^0x[a-fA-F0-9]{64}$/.test(message)) { // If Private Key
                ctx.session.tmpWallet = {
                    address: await web3utils.privateKeyToAddress(message),
                    privateKey: message,
                    encPrivateKey: utils.cipher(message, ctx.session.inputPincode.pincode)
                }
            } else {
                // input error checking
                if (/^0x[a-zA-z0-9]+$/.test(message)) {
                    await utils.botDeleteMessage(ctx);
                    return await ctx.replyWithHTML(ctx.i18n.t(ctx.session.namespace + ".wrong_private_key"));
                }
                // If mnemonic
                ctx.session.tmpWallet = await web3utils.mnemonicToWallet(message);
                ctx.session.tmpWallet = {
                    ...ctx.session.tmpWallet,
                    encPrivateKey: utils.cipher(ctx.session.tmpWallet.privateKey, ctx.session.inputPincode.pincode)
                }
            }
            await utils.botDeleteMessage(ctx);
            await Wallet.create({
                _id: ctx.from.id,
                username: ctx.from.username,
                address: ctx.session.tmpWallet.address,
                encPrivateKey: ctx.session.tmpWallet.encPrivateKey,
                lastActivityAt: Date.now(),
            });
            ctx.session.tmpWallet = undefined;
            await ctx.replyWithHTML(ctx.i18n.t(ctx.session.namespace + ".success"));
            return await ctx.scene.leave();
        } catch (e) { console.log(e) }
    }
);