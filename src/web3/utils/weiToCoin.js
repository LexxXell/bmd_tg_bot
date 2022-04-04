const Web3 = require("web3");

module.exports = (weiValue) => {
    value = String(Web3.utils.fromWei(weiValue));
    return value.split(".").length == 2
        ? value.split(".")[0] + "." + value.split(".")[1].slice(0, process.env.BOT_WALLET_DECIMALS)
        : value.split(",").length == 2
            ? value.split(",")[0] + "." + value.split(".")[1].slice(0, process.env.BOT_WALLET_DECIMALS)
            : value
}