const { Wallet } = require("../db");

module.exports = async (ctx, next) => {
    ctx.wallet = Wallet.findById(ctx.from.id)
        ? await Wallet.findById(ctx.from.id)
        : false
    return next();
}