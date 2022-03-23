const HDWallet = require('ethereum-hdwallet')

module.exports = async mnemonic => {
    const hdwallet = HDWallet.fromMnemonic(mnemonic);
    return {
        address: `0x${hdwallet.derive(`m/44'/60'/0'/0/0`).getAddress().toString('hex')}`,
        privateKey: `0x${hdwallet.derive(`m/44'/60'/0'/0/0`).getPrivateKey().toString('hex')}`,
    }
}