const weiToCoin = require("./weiToCoin");
const checkFunds = require("./checkFunds");
const generateWallet = require("./generateWallet");
const getWalletBalance = require("./getWalletBalance");
const mnemonicToWallet = require("./mnemonicToWallet");
const preparationAddress = require("./preparationAddress");
const privateKeyToAddress = require("./privateKeyToAddress");
const privateKeyToPublicKey = require("./privateKeyToPublicKey");
const signContractTransaction = require("./signContractTransaction");
const preparationTransactionData = require("./preparationTransactionData");

module.exports = {
    weiToCoin,
    checkFunds,
    generateWallet,
    getWalletBalance,
    mnemonicToWallet,
    preparationAddress,
    privateKeyToAddress,
    privateKeyToPublicKey,
    signContractTransaction,
    preparationTransactionData,
    
}