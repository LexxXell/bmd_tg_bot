const createKeccakHash = require('keccak');
const { toChecksumAddress } = require('ethereum-checksum-address');
const { publicKeyCreate, publicKeyConvert } = require('secp256k1');

module.exports = async privateKey => {
    if (!Buffer.isBuffer(privateKey)) {
        if (typeof privateKey !== 'string') {
            throw new Error('Expected Buffer or string as argument')
        }
        privateKey = privateKey.slice(0, 2) === '0x' ? privateKey.slice(2) : privateKey
        privateKey = Buffer.from(privateKey, 'hex')
    }
    publicKey = Buffer.from(publicKeyCreate(privateKey, false))
    publicKey = Buffer.from(publicKeyConvert(publicKey, false)).slice(1)
    const hash = createKeccakHash('keccak256').update(publicKey).digest()
    return toChecksumAddress(hash.slice(-20).toString('hex')).toLowerCase()
}