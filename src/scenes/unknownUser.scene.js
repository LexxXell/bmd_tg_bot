const WizardScene = require('telegraf/scenes/wizard')
const utils = require("../utils");

module.exports = new WizardScene(
    "unknownUser",
    async ctx => {
        try {
            await ctx.replyWithHTML(
                ctx.i18n.t("unknownUser.greeting")
            );
            return ctx.wizard.next();
        } catch (e) { console.log(e) }
    },
    async ctx => {
        try {
            switch (ctx.message.text) {
                case ("/createWallet"):
                    return await ctx.scene.enter('createWallet');
                case ("/importWallet"):
                    return await ctx.scene.enter('importWallet');
                case ("/cancel"):
                    await ctx.replyWithHTML(ctx.i18n.t("cancel"));
                    return ctx.scene.leave();
                default:
                    return await utils.botDeleteMessage(ctx);
            }
        } catch (e) { console.log(e) }
    }
);