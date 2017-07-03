const pug = require('pug')
const index = pug.compileFile('./views/index.pug')
const login = pug.compileFile('./views/login.pug')
const signup = pug.compileFile('./views/signup.pug')
const profile = pug.compileFile('./views/profile.pug')

module.exports = function (app, passport) {

    app.get('/', (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(index({}))
        res.end()
    })

    app.get('/login', (req, res) => {
        res.render('../views/login.pug',{message:req.flash('loginMessage')})
    })

    app.post('/login',passport.authenticate('local-login',{
        successRedirect:'/profile',
        failureRedirect:'/login',
        failureFlash:true
    }))

    app.get('/signup', (req, res) => {
        res.render('../views/signup.pug', { message: req.flash('signupMessage') })
    })

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
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