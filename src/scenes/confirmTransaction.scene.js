const WizardScene = require("telegraf/scenes/wizard")

const web3 = require("../web3");
const web3utils = require("../web3/utils");
const utils = require("../utils");

const inputPincode = require("./sketches/inputPincode");

module.exports = new WizardScene(
    "confirmTransaction",
    async ctx => {

        // Sketches session initialization
        ctx.session.inputPincode = Object();
        ctx.session.inputPincode.namespace = ""; // Special namespace
        ctx.session.inputPincode.callback = async ctx => {
            let privateKey = utils.decipher(ctx.session.wallet.encPrivateKey, ctx.message.text)
            let transaction
            if (privateKey !== "") {
                if (ctx.session.transactionData.coinName == process.env.BOT_MAIN_COIN_NAME) {
                    // Если транзакция основной монеты
                    transaction = await web3.eth.accounts.signTransaction({
                        gas: String(ctx.session.transactionData.gasFee),
                        to: String(ctx.session.transactionData.addressTo),
                        value: web3.utils.toWei(String(ctx.session.transactionData.amount), 'ether'),
                    }, privateKey);
                } else if (ctx.session.transactionData.coinName in ctx.session.contracts.contract) {
                    // Если транзакция контрактной монеты
                    transaction = web3utils.signContractTransaction({
                        contractInstance: new web3.eth.Contract(
                            JSON.parse(ctx.session.contracts.abi[ctx.session.contracts.contract[ctx.session.transactionData.coinName].abi]),
                            ctx.session.contracts.contract[ctx.session.transactionData.coinName].address,
                        ),
                        addresFrom: ctx.session.wallet.address,
                        addressTo: ctx.session.transactionData.addressTo,
                        amount: ctx.session.transactionData.amount,
                        nonce: await web3.eth.getTransactionCount(ctx.session.wallet.address),
                        gas: ctx.session.transactionData.gasFee
                    }, privateKey);
                }

                // Отправляем транзакцию
                try {
                    await ctx.replyWithHTML(ctx.i18n.t("walletSend.transactionSended"));
                    const receipt = await web3.eth.sendSignedTransaction(
                        transaction.rawTransaction
                    );
                    await ctx.replyWithHTML(ctx.i18n.t("walletSend.transactionSuccess", {
                        hash: receipt.transactionHash,
                    }));
                } catch (e) {
                    console.log("[ERROR] walletSend sendSignedTransaction\n" + e)
                    await ctx.replyWithHTML(ctx.i18n.t("walletSend.transactionError"));
                }

                privateKey = undefined;
                ctx.session.transactionData = undefined;
                return await ctx.scene.leave();
            }
        }

        await ctx.replyWithHTML(ctx.i18n.t("walletSend.transactionData", {
            addressFrom: ctx.session.wallet.address,
            addressTo: ctx.session.transactionData.addressTo,
            amount: ctx.session.transactionData.amount,
            symbol: ctx.session.transactionData.coinName == process.env.BOT_MAIN_COIN_NAME
                ? process.env.BOT_MAIN_COIN_SYMBOL
                : ctx.session.contracts.contract[ctx.session.transactionData.coinName].symbol
        }));

        return await ctx.wizard.next();
    },
    inputPincode
);