const { Composer } = require("telegraf")

const composer = new Composer();

composer.start(async ctx => {
    if (!ctx.session.wallet) {
        await ctx.replyWithHTML(ctx.i18n.t("start.unknown.greeting", { ctx }));
        try {
            await ctx.scene.enter("unknownUser");
        } catch (e) { "[ERROR] start.composer enter scene unknownUser. " + (e) }
        return
    }
    await ctx.reply(ctx.i18n.t("start.known.greeting", { ctx }));
})

composer.help(async ctx => {
    await ctx.replyWithHTML(ctx.i18n.t("help", { ctx }));
})

module.exports = composer