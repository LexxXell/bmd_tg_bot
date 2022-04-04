module.exports = async (ctx, next) => {
    ctx.admin = (ctx.from.id == process.env.BOT_ADMIN_ID)
    return next();
}