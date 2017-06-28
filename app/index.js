const express = require('express')
const passport = require('passport')
const session = require('express-session')
const mongoStore = require('connect-mongo')(session)

const app = express()

app.use(session({
    store:new mongoStore({
        url: config.mongoStore.url
    })
}))