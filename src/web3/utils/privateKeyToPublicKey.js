const { publicKeyCreate } = require('secp256k1');

module.exports = async privateKey => {
    if (!Buffer.isBuffer(privateKey)) {
      if (typeof privateKey !== 'string') {
        throw new Error('Expected Buffer or string as argument')
      }  
      privateKey = privateKey.slice(0, 2) === '0x' ? privateKey.slice(2) : privateKey
      privateKey = Buffer.from(privateKey, 'hex')
    }  
    return `0x${Buffer.from(publicKeyCreate(privateKey, false)).toString("hex").slice(2)}`
  }