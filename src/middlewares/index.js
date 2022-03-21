const setLangaugeMiddleware = require("./setLanguage");
const getWalletMiddleware = require("./getWallet");
const checkWeb3ConnectionMiddleware = require("./checkWeb3Connection");

module.exports = {
    getWalletMiddleware,
    setLangaugeMiddleware,
    checkWeb3ConnectionMiddleware,
}