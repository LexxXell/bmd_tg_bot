const WizardScene = require('telegraf/scenes/wizard')
const utils = require("../utils");

const inputPincode = require("./sketches/inputPincode");

module.exports = new WizardScene(
    "deleteUserFromDb",
    inputPincode
);

