module.exports = async (ctx, next) => {
    ctx.i18n.locale(ctx.from.language_code)
    return next();
}