const WizardScene = require('telegraf/scenes/wizard')
const utils = require("../utils");
const web3utils = require('../web3/utils');

module.exports = new WizardScene(
    "walletSendWizard",
    async ctx => {
        try {
            await ctx.replyWithHTML(ctx.i18n.t("walletSend.wizard.greeting", { coinList: utils.getCoinList(ctx, false, "/") }));
            return ctx.wizard.next();
        } catch (e) { console.log("[ERROR] walletSendWizard \n" + e) }
    },
    async ctx => {
        try {
            if (ctx.message.text == "/cancel") {
                await ctx.replyWithHTML(ctx.i18n.t("cancel"));
                return ctx.scene.leave();
            }

            let coinName = ctx.message.text[0] === "/"
                ? ctx.message.text.slice(1)
                : ctx.message.text
            coinName = coinName == process.env.BOT_MAIN_COIN_NAME || coinName in ctx.session.contracts.contract
                ? ctx.message.text.slice(1)
                : undefined;
            if (!coinName) return await utils.botDeleteMessage(ctx);
            ctx.session.transactionData = {
                coinName,
            };

            await ctx.replyWithHTML(ctx.i18n.t("walletSend.wizard.addressRequiest"));
            return ctx.wizard.next();
        } catch (e) { console.log("[ERROR] walletSendWizard \n" + e) }
    },
    async ctx => {
        try {
            if (ctx.message.text == "/cancel") {
                await ctx.replyWithHTML(ctx.i18n.t("cancel"));
                return ctx.scene.leave();
            }

            let addressTo = await web3utils.preparationAddress(ctx, ctx.message.text.replace(/\s+/g, ' ').trim());
            if (!addressTo) return
            ctx.session.transactionData = {
                ...ctx.session.transactionData,
                addressTo,
            }

            await ctx.replyWithHTML(ctx.i18n.t(
                "walletSend.wizard.amountRequiest",
                { coinName: ctx.session.transactionData.coinName }
            ));
            return ctx.wizard.next();
        } catch (e) { console.log("[ERROR] walletSendWizard \n" + e) }
    },
    async ctx => {
        try {
            if (ctx.message.text == "/cancel") {
                await ctx.replyWithHTML(ctx.i18n.t("cancel"));
                return ctx.scene.leave();
            }
            if (!parseFloat(ctx.message.text)) {
                await utils.botDeleteMessage(ctx);
                return await utils.sendTempMessage({
                    ctx,
                    message: ctx.i18n.t("walletSend.wizard.wrongAmount"),
                    ms: 2000,
                })
            }

            ctx.session.transactionData = {
                ...ctx.session.transactionData,
                amount: Math.abs(parseFloat(ctx.message.text)),
            }

            if (await web3utils.preparationTransactionData(ctx))
                return await ctx.scene.enter("confirmTransaction");
            return await ctx.replyWithHTML(ctx.i18n.t(
                "walletSend.wizard.amountRequiest",
                { coinName: ctx.session.transactionData.coinName }
            ));

        } catch (e) { console.log("[ERROR] walletSendWizard \n" + e) }
    }
);