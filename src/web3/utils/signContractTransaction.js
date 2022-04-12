const Web3 = require("web3");
const { Transaction } = require('ethereumjs-tx');
const Common = require("ethereumjs-common").default;

const TransactionData = {
    contractInstance: Object(),
    addresFrom: String(),
    addressTo: String(),
    amount: String(),
    nonce: Number(),
    gas: String(),
}

module.exports = (transactionData = TransactionData, privateKey = String()) => {

    const transaction = new Transaction(
        {
            from: transactionData.addresFrom,
            gasPrice: Web3.utils.toHex(process.env.WEB3_GASPRICE_CONTRACT ? process.env.WEB3_GASPRICE_CONTRACT : 1e9),
            gasLimit: Web3.utils.toHex(transactionData.gas),
            to: transactionData.contractInstance._address,
            value: "0x0",
            data: transactionData.contractInstance.methods.transfer(
                transactionData.addressTo,
                Web3.utils.toHex(Web3.utils.toWei(transactionData.amount, "ether"))
            ).encodeABI(),
            nonce: Web3.utils.toHex(transactionData.nonce),
        },
        process.env.WEB3_NETWORK_CUSTOM == "true"
            ? {
                common: Common.forCustomChain(
                    'mainnet',
                    {
                        name: process.env.WEB3_NETWORK_NAME,
                        networkId: parseInt(process.env.WEB3_NETWORK_ID),
                        chainId: parseInt(process.env.WEB3_NETWORK_CHAINID),
                    },
                    process.env.WEB3_NETWORK_HARDFORK,
                    process.env.WEB3_NETWORK_SAPPORTED_HARDFORKS
                        ? process.env.WEB3_NETWORK_SAPPORTED_HARDFORKS.split(", ")
                        : undefined
                )
            }
            : undefined
    );

    transaction.sign(
        Buffer.from(
            /^0x/.test(privateKey)
                ? privateKey.slice(2)
                : privateKey,
            "hex"
        )
    );

    return {
        rawTransaction: '0x' + transaction.serialize().toString('hex'),
    }
}