const config = {}

config.mongoStore = {
    url: process.env.MONGO_STORE_URI,
    secret: process.env.MONGO_STORE_SECRET
}

module.exports = config