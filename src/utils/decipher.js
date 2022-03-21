var CryptoJS = require("crypto-js");

module.exports = (encString, secret) => {
    return CryptoJS.AES.decrypt(encString, secret).toString(CryptoJS.enc.Utf8);
}