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
]);

const i18n = new TelegrafI18n({
    defaultLanguage: process.env.BOT_DEFAULT_LANGUAGE,
    allowMissing: false,
    directory: path.resolve(__dirname, 'locales')
});

const commandInspector = new CommandInspector(path.resolve(__dirname, 'commands.json'));

bot.use(session());
bot.use(i18n.middleware());

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


/**
    ТЕСТОВЫЙ КУСОК КОДА (УДАЛИТЬ ПОЗЖЕ)
 */

bot.command("send", async ctx => {
    const web3 = require("./web3")
    const utils = require("./utils");
    let addressTo = "0x8f037bc517d2388ae7e3fe5f3bb2d469a2320d8c";
    let privateKey = utils.decipher(ctx.wallet.encPrivateKey, "1234");
    const createTransaction = await web3.eth.accounts.signTransaction(
        {
            gas: process.env.BOT_WEB3_GASPRICE,
            to: addressTo,
            value: web3.utils.toWei('1', 'ether'),
        },
        privateKey
    );
    // Send Tx and Wait for Receipt
    const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
    );
    await ctx.reply(
        `Transaction successful with hash: ${createReceipt.transactionHash}`
    );
    await ctx.reply(web3.utils.toWei('1', 'ether'))
});

bot.command("balance", async ctx => {
    const web3 = require("./web3");
    // const weiToCoin = require("./web3/utils/weiToCoin");

    await ctx.reply("Balance of 0x8f037bc517d2388ae7e3fe5f3bb2d469a2320d8c")
    await ctx.reply(await web3.eth.getBalance("0x8f037bc517d2388ae7e3fe5f3bb2d469a2320d8c"))
})

/**
    КОНЕЦ ТЕСТОВОГО КУСКА КОДА
 */

bot.launch();