const { Composer } = require("telegraf");
const web3utils = require("../web3/utils");

const composer = new Composer();

composer.command("getAddress", async ctx => {
    await ctx.replyWithHTML(ctx.i18n.t("getAddress.greeting"));
    await ctx.replyWithHTML(ctx.i18n.t("getAddress.address", {address: ctx.session.wallet.address}));
})

module.exports = composer