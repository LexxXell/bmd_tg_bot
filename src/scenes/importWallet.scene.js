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
            if (/0x[A-Za-z0-9]+$/.test(ctx.message.text)) { // If Private Key
                ctx.session.wallet = {
                    address: await web3utils.privateKeyToAddress(ctx.message.text),
                    privateKey: ctx.message.text,
                    encPrivateKey: utils.cipher(ctx.message.text, ctx.session.inputPincode.pincode)
                }
            } else { // If mnemonic
                ctx.session.wallet = await web3utils.mnemonicToWallet(ctx.message.text);
                ctx.session.wallet = {
                    ...ctx.session.wallet,
                    encPrivateKey: utils.cipher(ctx.session.wallet.privateKey, ctx.session.inputPincode.pincode)
                }
            }
            await utils.botDeleteMessage(ctx);
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