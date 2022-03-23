require("dotenv").config();
require("./db");

const path = require('path');

const { Telegraf, Stage, session } = require('telegraf');
const TelegrafI18n = require('telegraf-i18n');

const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Stage([
    require("./scenes/createWallet.scene"),
    require("./scenes/importWallet.scene"),
    require("./scenes/unknownUser.scene"),

    require("./scenes/createWallet_new.scene"),
    require("./scenes/importWallet_new.scene"),
]);

const i18n = new TelegrafI18n({
    defaultLanguage: process.env.BOT_DEFAULT_LANGUAGE,
    allowMissing: false,
    directory: path.resolve(__dirname, 'locales')
});

bot.use((ctx, next) =>  require("./utils").logger(ctx) || next());

bot.use(session());
bot.use(i18n.middleware());
bot.use(require("./middlewares").setLangaugeMiddleware);
bot.use(require("./middlewares").checkWeb3ConnectionMiddleware);
bot.use(require("./middlewares").getWalletMiddleware);
bot.use(stage.middleware());
bot.use(require("./composers/start.composer"));

bot.command("crWallet", async ctx => {
    await ctx.scene.enter("createWallet_new");
})

bot.command("imWallet", async ctx => {
    await ctx.scene.enter("importWallet_new");
})

bot.launch();