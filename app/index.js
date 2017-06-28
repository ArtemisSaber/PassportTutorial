const express = require('express')
const passport = require('passport')
const session = require('express-session')
const mongoStore = require('connect-mongo')(session)
const config = require('../config')

const app = express()

app.use(session({
    store: new mongoStore({
        url: config.mongoStore.url
    }),
    secret: config.mongoStore.secret,
    resave: false,
    saveUninitialized: false,
}))