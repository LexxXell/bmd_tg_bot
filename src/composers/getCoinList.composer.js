const { Composer } = require("telegraf");
const web3utils = require("../web3/utils");

const composer = new Composer();

composer.command("coinList", async ctx => {
    let coinList = process.env.BOT_MAIN_COIN_NAME + " - " + process.env.BOT_MAIN_COIN_SYMBOL;

    for (coinName in ctx.session.contracts.contract)
        coinList += " \n" + coinName + " - " + ctx.session.contracts.contract[coinName].symbol;

    await ctx.replyWithHTML(ctx.i18n.t("coinList", { coinList }));
})

module.exports = composer