const web3 = require("../web3");

module.exports = async (ctx, next) => {
    try {
        await web3.eth.getBlockNumber();
        return next();
    } catch (e) {
        console.log("[ERROR] WEB3 connection error. " + e)
        ctx.reply(ctx.i18n.t("web3_error"))
    }
}