const { Composer } = require("telegraf");
const utils = require("../utils");
const { Wallet } = require("../db");

const composer = new Composer();

composer.command("sos", async ctx => {
    ctx.session.sosMessageId = (await ctx.replyWithHTML(ctx.i18n.t("deleteAccount.greeting"))).message_id;
    try {
        // Sketches session initialization
        ctx.session.inputPincode = Object();
        ctx.session.inputPincode.namespace = ""; // Special namespace
        ctx.session.inputPincode.callback = async ctx => {
            if (utils.decipher(ctx.session.wallet.encPrivateKey, ctx.message.text) !== "") {
                ctx.session.wallet = undefined;
                await Wallet.findByIdAndDelete(ctx.from.id);
                utils.botDeleteMessage(ctx, ctx.session.sosMessageId);
                utils.sendTempMessage({
                    ctx,
                    message: ctx.i18n.t("deleteAccount.success")
                })
                return await ctx.scene.leave();
            }
        }
        await ctx.scene.enter("deleteUserFromDb");
    } catch (e) { "[ERROR] SOS.composer enter scene deleteUserFromDb. " + (e) }
    return
})

module.exports = composer