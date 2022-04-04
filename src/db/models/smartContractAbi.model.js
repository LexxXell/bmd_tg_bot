const mongoose = require('mongoose');

module.exports = mongoose.model('SmartContractAbi', mongoose.Schema(
    {
        name: { type: String, unique: true },
        abi: { type: String },
    },
    {
        timestamps: true,
    }
));