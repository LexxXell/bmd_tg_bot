require("dotenv").config();
require("./db");

const path = require('path');

const { Telegraf, Stage, session } = require('telegraf')
const TelegrafI18n = require('telegraf-i18n')

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Stage([
    require("./scenes/createWallet.scene"),
])

const i18n = new TelegrafI18n({
    defaultLanguage: process.env.BOT_DEFAULT_LANGUAGE,
    allowMissing: false,
    directory: path.resolve(__dirname, 'locales')
})

bot.use((ctx, next) => console.log(ctx) || next());
bot.use(session());
bot.use(i18n.middleware());
bot.use(require("./middlewares").setLangaugeMiddleware);
bot.use(require("./middlewares").checkWeb3ConnectionMiddleware);
bot.use(require("./middlewares").getWalletMiddleware);
bot.use(stage.middleware());
bot.use(require("./composers/start.composer"));



bot.launch();