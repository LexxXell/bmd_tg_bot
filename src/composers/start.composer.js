const { Composer } = require("telegraf")

const composer = new Composer();

composer.start(async ctx => {
    if (!ctx.session.wallet) {
        await ctx.reply(ctx.i18n.t("greeting_new", { ctx }));
        try {
            await ctx.scene.enter("unknownUser");
        } catch (e) { (e) }
        return
    }
    await ctx.reply(ctx.i18n.t("greeting", { ctx }));
    await ctx.reply(ctx.i18n.t("help_invitation", { ctx }));
})

composer.help(async ctx => {
    await ctx.reply(ctx.i18n.t("help", { ctx }));
})

module.exports = composer