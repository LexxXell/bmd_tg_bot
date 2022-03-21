const WizardScene = require('telegraf/scenes/wizard')

const { Wallet } = require("../db");

const utils = require("../utils");

module.exports = new WizardScene(
    "unregistered",
    async ctx => {
        try {
            return ctx.wizard.next();
        } catch (e) { console.log(e) }
    },
    async ctx => {
        try { 
            return ctx.scene.leave();
        } catch (e) { console.log(e) }
    }
);

