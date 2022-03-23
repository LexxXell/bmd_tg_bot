const WizardScene = require('telegraf/scenes/wizard')

module.exports = new WizardScene(
    "unknownUser",
    async ctx => {
        try {
            await ctx.replyWithHTML("Ты желаешь создать новый кошелёк или импортировать уже существующий?");
            await ctx.replyWithHTML("Создать новый /createWallet");
            await ctx.replyWithHTML("Импортировать /importWallet");
            await ctx.replyWithHTML("Отмена /cancel");
            return ctx.wizard.next();
        } catch (e) { console.log(e) }
    },
    async ctx => {
        try {
            switch (ctx.message.text) {
                case ("/createWallet"):
                    return await ctx.scene.enter('createWallet');
                case ("/importWallet"):
                    return await ctx.scene.enter('importWallet');
                case ("/cancel"):
                    await ctx.replyWithHTML(ctx.i18n.t("unknownUser.cancel"));
                    return ctx.scene.leave();
                default:
                    return await ctx.deleteMessage(ctx.message.chat.chat_id, ctx.message.message_id);
            }
        } catch (e) { console.log(e) }
    }
);

