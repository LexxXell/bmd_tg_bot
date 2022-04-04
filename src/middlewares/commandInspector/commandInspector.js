const fs = require("fs");

module.exports = class {
    constructor(commandsJsonFile) {
        this.commands = {};
        try {
            if (fs.existsSync(commandsJsonFile))
                this.commands = JSON.parse(fs.readFileSync(commandsJsonFile));
        } catch (e) {
            console.log("[ERROR] commandInspector constructor: " + e);
        }

        this.middleware = this.middleware.bind(this);
    }

    middleware(ctx, next) {
        let command = "";
        if (!ctx.message) return next();
        if (ctx.message.text[0] == "/")
            command = ctx.message.text.split(" ")[0].slice(1);

        // Check Admin access
        if ((command.indexOf(this.commands.admin.namespace) === 0 ||
            this.commands.admin.extends.indexOf(command) >= 0) && !ctx.admin) {
            return ctx.replyWithHTML(ctx.i18n.t("invalid_command"));
        }

        // Check if a command needs a wallet
        if ((command.indexOf(this.commands.wallet.namespace) === 0 ||
            this.commands.wallet.extends.indexOf(command) >= 0) && !ctx.wallet) {
            return ctx.replyWithHTML(ctx.i18n.t("need_wallet"));
        }

        return next();
    }
}