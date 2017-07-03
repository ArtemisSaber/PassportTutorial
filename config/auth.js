var passport_local = require('passport-local')
var LocalStrategy = passport_local.Strategy
var User = require('../app/models/user')

//save user entity
function storeUser(email, pwd, callback) {
    var user = new User();
    user.local.email = email
    user.generateHash(pwd, res => {
        user.local.pwd = res
        user.save(err => {
            if (err) {
                throw err
            }
            callback(err, user)
        })
    })
}


module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
    //signup strategy
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pwd',
        passReqToCallback: true
    }, (req, email, pwd, done) => {
        if (email) {
            email = email.toLowerCase()
        }
        process.nextTick(function () {
            User.findOne({ 'local.email': email }, (err, user) => {
                if (err) {
                    return done(err)
                }
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email was already registered'))
                } else {
                    storeUser(email, pwd, (err, User) => {
                        return done(err, User)
                    })
                }
            })
        })
    }))

    //login strategy
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pwd',
        passReqToCallback: true
    }, (req, email, pwd, done) => {
        User.findOne({ 'local.email': email }, (err, user) => {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'User not found'))
            }
            user.verifyPassword(pwd, res => {
                if (!res) {
                    return done(null, false, req.flash('loginMessage', 'WrongPassword'))
                }
                return done(null, user);
            })

        })
    }))
}