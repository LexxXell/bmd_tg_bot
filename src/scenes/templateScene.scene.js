const WizardScene = require('telegraf/scenes/wizard')
const templateSketch = require("./sketches/templateSketch");

const templateSketchCallback = async ctx => {
    await ctx.reply("templateSketch callback");
}

module.exports = new WizardScene(
    "templateScene",
    async ctx => {
        try {
            const namespace = "templateScene";
            ctx.session.namespace = namespace; // Global namespace
            
            // Sketches session initialization
            ctx.session.templateSketch = Object();
            ctx.session.templateSketch.namespace = ""; // Special namespace
            ctx.session.templateSketch.callback = templateSketchCallback; // callback for additional features

            await ctx.replyWithHTML(ctx.i18n.t(ctx.session.namespace + ".greeting"));

            return await ctx.wizard.next();
        } catch (e) { console.log(e) }
    },

    templateSketch,

    async ctx => {
        try {
            await ctx.replyWithHTML(ctx.i18n.t(ctx.session.namespace + ".parting"));
            return await ctx.scene.leave();
        } catch (e) { console.log(e) }
    }
);

