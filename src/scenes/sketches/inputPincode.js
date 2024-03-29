const utils = require("../../utils");

module.exports = async ctx => {
    try {
        const sketchName = "inputPincode";
        const namespace = ctx.session[sketchName].namespace || ctx.session[sketchName].namespace === ""
            ? ctx.session[sketchName].namespace !== ""
                ? ctx.session[sketchName].namespace + "."
                : ""
            : ctx.session.namespace
                ? ctx.session.namespace + "."
                : ""

        if (ctx.message.text === "/cancel") {
            ctx.replyWithHTML(ctx.i18n.t("cancel"));
            return await ctx.scene.leave();
        };

        await utils.botDeleteMessage(ctx, ctx.message.id);

        if (!/^\d{4}$/.test(ctx.message.text)) return;

        // Проверка на ввод неправильного пинкода если есть кошелёк
        if (ctx.session.wallet && utils.decipher(ctx.session.wallet.encPrivateKey, ctx.message.text) == "") {
            return await utils.sendTempMessage({ 
                ctx,
                message: ctx.i18n.t("inputPincode.wrongPincode"),
                ms: 2000,
            });
        }

        if (typeof (ctx.session.inputPincode.callback) === "function") {
            let callback = ctx.session.inputPincode.callback
            ctx.session.inputPincode.callback = undefined;
            return await callback(ctx);
        }
        ctx.session.inputPincode = {
            pincode: ctx.message.text
        }

        await ctx.replyWithHTML(ctx.i18n.t(namespace + "inputPincode.next"));
        return ctx.wizard.next();

    } catch (e) { console.log("[ERROR] inputPincode sketch: " + e) }
}