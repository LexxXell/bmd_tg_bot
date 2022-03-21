var CryptoJS = require("crypto-js");

// // Encrypt
// var ciphertext = CryptoJS.AES.encrypt('my message adscfasdvasdv sfvsa sfvsfvsfb  wsfdr', '1234').toString();
// console.log(ciphertext)

// // Decrypt
// var bytes  = CryptoJS.AES.decrypt(ciphertext, '1234');
// var originalText = bytes.toString(CryptoJS.enc.Utf8);

// console.log(originalText); // 'my message'

module.exports = (string, secret) => {
    return CryptoJS.AES.encrypt(string, secret).toString();
}