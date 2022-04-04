module.exports = async (ctx, message_id, chat_id) => {
    try {
        return await ctx.telegram.deleteMessage(
            chat_id
                ? chat_id
                : ctx.message.chat.id,
            message_id
                ? message_id
                : ctx.message.message_id
        );
    } catch (e) { console.log("[ERROR] Can`t delete message. " + e) }
}