module.exports = async (ctx, next) => {
    if (!ctx.message) return next();
    if (ctx.message.text[0] == "/") {
        const commandArgs = ctx.message.text.split(" ");
        if (commandArgs.length === 2 &&
            (commandArgs[1] === "help" ||
                commandArgs[1] === "Help" ||
                commandArgs[1] === "HELP")) {
            try {
                return await ctx.replyWithHTML(
                    ctx.i18n.t(
                        commandArgs[0].slice(1) + "." + commandArgs[1]
                    )
                )
            } catch {
                return await ctx.replyWithHTML(ctx.i18n.t("no_help"));
            }
        }
    }
    return next();
}