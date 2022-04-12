const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(process.env.MONGO_URL ? process.env.MONGO_URL : "mongodb://localhost:27017");

mongoose.connection

mongoose.connection.on('error', err => {
    console.log('[ERROR] MONGODB ', err)
})

const then = async callback => {
    if (typeof (callback) === "function")
        return await callback();
}

mongoose.connection.once('open', async () => {
    console.log('[INFO] MONGODB connected')
    await then();
})

module.exports = {then, mongoose};