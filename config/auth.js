var passport_local = require('passport-local')
var LocalStrategy = passport_local.Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
var User = require('../app/models/user')
var Auth = require('./user_r')
if (!Auth) {
    Auth = require('./user')
}

//save user entity
function storeUser(user = new User(), email, pwd, callback) {
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
//save facebook user entity
function storeFacebookUser(user = new User(), profile, token, callback) {
    user.facebook.id = profile.id
    user.facebook.token = token
    user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName
    user.facebook.email = profile.emails[0].value
    user.save(err => {
        if (err) {
            throw err
        }
        callback(err, user)
    })
}
function storeGoogleUser(user = new User(), profile, token, callback) {
    console.log(profile.emails[0].value)
    user.google.id = profile.id
    user.google.token = token
    user.google.name = profile.displayName
    user.gooogle.email = profile.emails[0].value
    user.save(err => {
        if (err) {
            throw err
        }
        callback(err, user)
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
                    storeUser(undefined,email, pwd, (err, User) => {
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

    //facebook strategy
    passport.use(new FacebookStrategy({
        clientID: process.env.APPID || Auth.facebookAuth.clientID,
        clientSecret: process.env.APPSECRET || Auth.facebookAuth.clientSecret,
        callbackURL: Auth.facebookAuth.callbackURL,
        passReqToCallback: true
    }, (req, token, refreshToken, profile, done) => {
        process.nextTick(() => {
            if (!req.user) {
                User.findOne({ 'facebook.id': profile.id }, (err, user) => {
                    if (err) {
                        return done(err)
                    }
                    if (user) {
                        return done(null, user)
                    } else {
                        storeFacebookUser(undefined, profile, token, (err, user) => {
                            if (err) {
                                return done(err)
                            }
                            return done(null, user)
                        })
                    }
                })
            } else {
                var user = req.user
                storeFacebookUser(user, profile, token, (err, user) => {
                    if (err) {
                        return done(err)
                    }
                    return done(null, user)
                })
            }
        })
    }
    ))

    //google strategy
    passport.use(new GoogleStrategy({
        clientID: Auth.googleAuth.clientID,
        clientSecret: Auth.googleAuth.clientSecret,
        callbackURL: Auth.googleAuth.callbackURL,
        passReqToCallback: true
    }, (req, token, refreshToken, profile, done) => {
        process.nextTick(() => {
            if (!req.user) {
                User.findOne({ 'google.id': profile.id }, (err, user) => {
                    if (err) {
                        return done(err)
                    }
                    if (user) {
                        return done(null, user)
                    } else {
                        storeGoogleUser(undefined, profile, token, (err, user) => {
                            return done(null, user)
                        })
                    }
                })
            }else{
                var user = req.user
                storeGoogleUser(user,profile,token,(err,user)=>{
                    return done(null,user)
                })
            }
        })
    }
    ))
}