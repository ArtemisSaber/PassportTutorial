var passport_local = require('passport-local')
var LocalStrategy = passport_local.Strategy
var User = require('../app/models/user')

module.exports = function(passport){
    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })
    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
            done(err,user)
        })
    })
    passport.use('local-signup',new LocalStrategy({
        usernameField:'email',
        passwordField:'pwd',
        passReqToCallback:true
    },(req,email,pwd,done)=>{
        if(email){
            email = email.toLowerCase()
        }
        process.nextTick(function(){
            User.findOne({'local.email':email},(err,user)=>{
                if(err){
                    return done(err)
                }
                if(user){
                    return done(null,false,req.flash('signupMessage','That email was already registered'))
                }else{
                    var newUser = new User();
                    newUser.local.email = email
                    newUser.generateHash(pwd,res=>{
                        newUser.local.pwd = res
                        newUser.save(err=>{
                            if(err){
                                throw err
                            }
                            return done(null,newUser)
                        })
                    })

                    // newUser.save(err=>{
                    //     if(err){
                    //         throw err
                    //     }
                    //     return done(null,newUser)
                    // })
                }
            })
        })
    }))

    passport.use('local-login',new LocalStrategy({
        usernameField: 'email',
        passwordField:'pwd',
        passReqToCallback:true
    },(req,email,pwd,done)=>{
        User.findOne({'local.email':email},(err,user)=>{
            if(err){
                return done(err)
            }
            if(!user){
                return done(null,false,req.flash('loginMessage','User not found'))
            }
            user.verifyPassword(pwd,res=>{
                if(!res){
                    return done(null,false,req.flash('loginMessage','WrongPassword'))
                }
                return done(null,user);
            })
            
        })
    }))
}