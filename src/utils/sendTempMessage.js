const botDeleteMessage = require("./botDeleteMessage")

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async (data = { ctx: undefined, message: "", ms: Number(), method: "" }) => {
    try {
        const ctx = data.ctx;
        let message = data.message
            ? data.message
            : "";
        const ms = data.ms
            ? data.ms
            : 5000;
        const method = data.method
            ? data.method
            : "replyWithHTML";

        message = await ctx[method](message);
        await timeout(ms)
        botDeleteMessage(ctx, message.message_id)
    } catch (e) {
        console.log("[ERROR] sendTempMessage\n" + e)
    }
}