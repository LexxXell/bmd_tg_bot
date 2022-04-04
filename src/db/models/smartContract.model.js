const mongoose = require('mongoose');

module.exports = mongoose.model('SmartContract', mongoose.Schema(
    {
        name: { type: String, unique: true },
        autoName: { type: Boolean, default: false },
        symbol: { type: String, unique: true },
        autoSymbol: { type: Boolean, default: false },
        address: { type: String, unique: true },
        abi: { type: String },
        type: { type: String },
    },
    {
        timestamps: true,
    }
));