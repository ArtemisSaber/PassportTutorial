const pug = require('pug')
const index = pug.compileFile('./views/index.pug')
const login = pug.compileFile('./views/login.pug')
const signup = pug.compileFile('./views/signup.pug')
const profile = pug.compileFile('./views/profile.pug')

module.exports = function (app, passport) {

    app.get('/', (req, res) => {
        if (req.isAuthenticated()) {
            res.render('../views/profile.pug',{user:req.user})
        } else {
            res.render('../views/index.pug')
        }
    })
    //local authentication
    app.get('/login', (req, res) => {
        res.render('../views/login.pug', { message: req.flash('loginMessage') })
    })

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }))
    //facebook authorization
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }))

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }))

    //google authorization
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }))

    //github authorization
    app.get('/auth/github', passport.authenticate('github', { scope: 'user:email' }))
    app.get('/auth/github/callback', passport.authenticate('github', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }))

    //local signup
    app.get('/signup', (req, res) => {
        res.render('../views/signup.pug', { message: req.flash('signupMessage') })
    })

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }))

    //account link
    //local account
    app.get('/connect/local', (req, res) => {
        res.render('../views/connect_local.pug', { message: req.flash('loginMessage') })
    })
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/connect/local',
        failureFlash: true
    }))
    //facebook
    app.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }))
    app.get('/connect/facebool/callback', passport.authorize('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }))
    //google
    app.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }))
    app.get('/connect/google/callback', passport.authorize('google', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }))
    //github
    app.get('/connect/github', passport.authorize('github', { scope: 'email' }))
    app.get('/connect/github/callback', passport.authorize('github', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }))


    app.get('/profile', isLoggedIn, (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(profile({
            user: req.user
        }))
        res.end()

    })

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/')
    })




}

var isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')
}