var CryptoJS = require("crypto-js");

module.exports = (encString, secret) => {
    try {
        return CryptoJS.AES.decrypt(encString, secret).toString(CryptoJS.enc.Utf8);
    } catch {
        return ""
    }
}