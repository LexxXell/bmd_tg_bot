const mongoose = require('mongoose');

module.exports = mongoose.model('Wallet', mongoose.Schema(
    {
        _id: String,
        username: String,
        address: { type: String, unique: true },
        encPrivateKey: { type: String },
        lastActivityAt: Number,
        watchdogTimerDuration: { type: Number, default: 0 },
        watchdogDate: { type: Number, default: 0 },
        extWalletAddress: String,
    },
    {
        _id: false,
        timestamps: true,
    }
));