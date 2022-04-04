require("./db");
const {then, mongoose} = require("./db");
const Wallet = require("./models/wallet.model");
const SmartContract = require("./models/smartContract.model");
const SmartContractAbi = require("./models/smartContractAbi.model");

module.exports = {
    then,
    mongoose,
    Wallet,
    SmartContract,
    SmartContractAbi,
}