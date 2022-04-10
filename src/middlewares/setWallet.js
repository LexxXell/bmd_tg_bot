const { Wallet } = require("../db");

module.exports = async (ctx, next) => {
    if (!ctx.session.wallet)
        ctx.session.wallet = Wallet.findById(ctx.from.id)
            ? await Wallet.findById(ctx.from.id)
            : false
    return next();
}