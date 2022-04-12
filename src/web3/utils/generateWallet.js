var bip39 = require('bip39');
const HDWallet = require('ethereum-hdwallet')

module.exports = async () => {
    const mnemonic = bip39.generateMnemonic();
    const hdwallet = HDWallet.fromMnemonic(mnemonic);
    return {
        mnemonic,
        address: `0x${hdwallet.derive(`m/44'/60'/0'/0/0`).getAddress().toString('hex')}`,
        privateKey: `0x${hdwallet.derive(`m/44'/60'/0'/0/0`).getPrivateKey().toString('hex')}`,
    }
}