const setLangaugeMiddleware = require("./setLanguage");
const setWalletMiddleware = require("./setWallet");
const checkWeb3ConnectionMiddleware = require("./checkWeb3Connection");
const setAdminMiddleware = require("./setAdmin");
const setSmartContractsMiddleware = require("./setSmartContracts");
const commandHelpMiddleware = require("./commandHelp");

module.exports = {
    setWalletMiddleware,
    setLangaugeMiddleware,
    checkWeb3ConnectionMiddleware,
    setAdminMiddleware,
    setSmartContractsMiddleware,
    commandHelpMiddleware,
}