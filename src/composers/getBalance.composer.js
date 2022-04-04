const { Composer } = require("telegraf");
const web3utils = require("../web3/utils");

const composer = new Composer();

composer.command("getBalance", async ctx => {
    const balance = await web3utils.getWalletBalance(ctx);
    let balanceList = "";
    for (coin in balance) {
        balanceList += balance[coin].value + balance[coin].symbol + "\n";
    }
    await ctx.replyWithHTML(ctx.i18n.t("balance", { balanceList }));
});

module.exports = composer