module.exports = async ctx => {
    try {
        const namespace = ctx.session.templateSketch.namespace || ctx.session.templateSketch.namespace === ""
            ? ctx.session.templateSketch.namespace !== ""
                ? ctx.session.templateSketch.namespace + "."
                : ""
            : ctx.session.namespace
                ? ctx.session.namespace + "."
                : ""

        await ctx.replyWithHTML(ctx.i18n.t(namespace + "templateSketch.greeting"))
        
        if (ctx.message.text === "/cancel") {
            await ctx.replyWithHTML(ctx.i18n.t(namespace + "templateSketch.cancel"));
            return await ctx.scene.leave();
        };

        if (typeof (ctx.session.templateSketch.callback) === "function")
            await ctx.session.templateSketch.callback(ctx);
        // return await ctx.session.templateSketch.callback(ctx);

        if (ctx.message.text === "/next") {
            return await ctx.wizard.next();
        };

        await ctx.replyWithHTML(ctx.message.text);

        return await ctx.replyWithHTML(ctx.i18n.t(namespace + "templateSketch.next"));

    } catch (e) { console.log(e) }
}