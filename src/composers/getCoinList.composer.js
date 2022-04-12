const { Composer } = require("telegraf");
const utils = require("../utils");

const composer = new Composer();

composer.command("coinList", async ctx => {
    await ctx.replyWithHTML(ctx.i18n.t("coinList", { coinList: utils.getCoinList(ctx) }));
})

module.exports = composer