const { Composer } = require("telegraf")

const composer = new Composer();

composer.start(async ctx => {
    if (!ctx.wallet) {
        await ctx.reply(ctx.i18n.t("greeting_new", { ctx }));
        try {
            await ctx.reply("[a[a");
        } catch (e) { console.error("[ERROR] Scene 'ungerisreted.scene': ", e) }
        return
    }
    await ctx.reply(ctx.i18n.t("greeting", { ctx }));
    await ctx.reply(ctx.i18n.t("help_invitation", { ctx }));
})

composer.help(async ctx => {
    await ctx.reply(ctx.i18n.t("help", { ctx }));
})

module.exports = composer