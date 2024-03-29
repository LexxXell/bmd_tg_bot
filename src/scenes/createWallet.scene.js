const WizardScene = require('telegraf/scenes/wizard')
const inputPincode = require("./sketches/inputPincode");

const { Wallet } = require("../db");

const utils = require("../utils");
const web3utils = require("../web3/utils");


const createWallet = async ctx => {

    const ethWallet = await web3utils.generateWallet();
    const encPrivateKey = utils.cipher(ethWallet.privateKey, ctx.message.text);
    ctx.session.wallet = {
        ...ethWallet,
        encPrivateKey,
    }
    ctx.session.secretMessage = await ctx.replyWithHTML(
        ctx.i18n.t(ctx.session.namespace + ".walletData",
            { wallet: ctx.session.wallet })
    );
    await ctx.replyWithHTML(ctx.i18n.t(ctx.session.namespace + ".disclaimer"));

    return await ctx.wizard.next();
}

module.exports = new WizardScene(
    "createWallet",
    async ctx => {
        try {
            ctx.session.namespace = "createWallet"; // Global namespace

            // Sketches session initialization
            ctx.session.inputPincode = Object();
            ctx.session.inputPincode.namespace = ""; // Special namespace
            ctx.session.inputPincode.callback = createWallet; // callback for additional features

            await ctx.replyWithHTML(ctx.i18n.t(ctx.session.namespace + ".greeting"));
            await ctx.replyWithHTML(ctx.i18n.t("inputPincode.greeting"));
            return await ctx.wizard.next();
        } catch (e) { console.log(e) }
    },
    inputPincode,
    async ctx => {
        try {
            switch (ctx.message.text) {
                case ("/cancel"):
                    await ctx.replyWithHTML(ctx.i18n.t("cancel"));
                    break;
                case ("/agree"):
                    await Wallet.create({
                        _id: ctx.from.id,
                        username: ctx.from.username,
                        address: ctx.session.wallet.address,
                        encPrivateKey: ctx.session.wallet.encPrivateKey,
                        lastActivityAt: Date.now(),
                    });
                    await ctx.replyWithHTML(ctx.i18n.t(ctx.session.namespace + ".success"));
                    break;
                default:
                    return utils.botDeleteMessage(ctx);
            }
            await utils.botDeleteMessage(
                ctx,
                ctx.session.secretMessage.message_id
            );
            ctx.session.wallet = NaN
            return await ctx.scene.leave();
        } catch (e) { console.log(e) }
    }
);

