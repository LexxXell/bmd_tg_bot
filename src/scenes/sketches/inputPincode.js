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
            ctx.replyWithHTML(ctx.i18n.t(namespace + "inputPincode.cancel"));
            return await ctx.scene.leave();
        };

        await ctx.deleteMessage(ctx.message.chat.chat_id, ctx.message.message_id);

        if (!/^\d{4}$/.test(ctx.message.text)) return;

        if (typeof (ctx.session.inputPincode.callback) === "function")
            return await ctx.session.inputPincode.callback(ctx);

        ctx.session.inputPincode = {
            pincode: ctx.message.text
        }

        await ctx.replyWithHTML(ctx.i18n.t(namespace + "inputPincode.next"));
        return ctx.wizard.next();

    } catch (e) { console.log("[ERROR] inputPincode sketch: " + e) }
}