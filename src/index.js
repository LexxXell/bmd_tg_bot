const path = require('path');

require("dotenv").config();
require("./db").then(
    require("./utils/initSmartContracts")(
        path.resolve(__dirname, 'contracts'),
        path.resolve(__dirname, 'contracts_abi'),
    )
);

const { Telegraf, Stage, session } = require('telegraf');
const TelegrafI18n = require('telegraf-i18n');

const CommandInspector = require("./middlewares/commandInspector");

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Stage([
    require("./scenes/unknownUser.scene"),
    require("./scenes/createWallet.scene"),
    require("./scenes/importWallet.scene"),
    require("./scenes/deleteUserFromDb.scene"),
    require("./scenes/confirmTransaction.scene"),
    require("./scenes/walletSendWizard.scene"),
]);

const i18n = new TelegrafI18n({
    defaultLanguage: process.env.BOT_DEFAULT_LANGUAGE,
    allowMissing: false,
    directory: path.resolve(__dirname, 'locales')
});

const commandInspector = new CommandInspector(path.resolve(__dirname, 'commands.json'));

bot.use(session());
bot.use((ctx, next) => {
    if (ctx.message && ctx.message.text === "/start")
        ctx.session = {}
    return next();
});

bot.use(i18n.middleware());
bot.use(require("./middlewares").commandHelpMiddleware);

bot.use(require("./middlewares").setAdminMiddleware);
bot.use(require("./middlewares").setLangaugeMiddleware);
bot.use(require("./middlewares").checkWeb3ConnectionMiddleware);
bot.use(require("./middlewares").setWalletMiddleware);
bot.use(require("./middlewares").setSmartContractsMiddleware);

bot.use(commandInspector.middleware);

bot.use(stage.middleware());

bot.use(require("./composers/start.composer"));
bot.use(require("./composers/SOS.composer"));
bot.use(require("./composers/getBalance.composer"));
bot.use(require("./composers/getAddress.composer"));
bot.use(require("./composers/getCoinList.composer"));
bot.use(require("./composers/walletSend.composer"));


/**
    ТЕСТОВЫЙ КУСОК КОДА (УДАЛИТЬ ПОЗЖЕ)
 */


bot.command("test", async ctx => {
    ctx.reply(await require("./web3/utils").preparationAddress(ctx, "@aa"));
})

/**
    КОНЕЦ ТЕСТОВОГО КУСКА КОДА
 */

bot.launch();