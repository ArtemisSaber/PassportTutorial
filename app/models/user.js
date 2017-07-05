var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')

var userSchema = mongoose.Schema({
    local: {
        email: String,
        pwd: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        userName: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    github: {
        id:String,
        token:String,
        nickName:String,
        email:String
    }
})

userSchema.methods.generateHash = function (pwd,callback) {
    //return bcrypt.hashSync(pwd,bcrypt.genSaltSync(8))
    bcrypt.genSalt(8,(err,res)=>{
        if(err){
            throw err
        }
        bcrypt.hash(pwd,res,null,(err,res)=>{
            if(err){
                throw err
            }
            callback(res)
        })
    })
}

userSchema.methods.verifyPassword = function (password,callback) {
    bcrypt.compare(password, this.local.pwd,(err,res)=>{
        if(err){
            throw err
        }
        callback(res)
    })
    
}

module.exports = mongoose.model('User',userSchema)
