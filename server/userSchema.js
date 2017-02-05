const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

const userSchema = new Schema({
    username: String,
    password: String
})
userSchema.plugin(passportLocalMongoose)
const User = mongoose.model('users', userSchema)

const adminUser = new User({
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD
})
console.log(adminUser)
User.count({}, (err, count) => {
    if (count === 0) {
        User.register(new User({ username : ADMIN_USERNAME }), ADMIN_PASSWORD, function(err, account) {
            passport.authenticate('local')
        });
    }
})

module.exports = User