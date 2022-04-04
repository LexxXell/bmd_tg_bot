const { Composer } = require("telegraf");
const web3utils = require("../web3/utils");

const composer = new Composer();

composer.command("getAddress", async ctx => {
    await ctx.replyWithHTML(ctx.i18n.t("address", {ctx}));
})

module.exports = composer