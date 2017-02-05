const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

const db = mongoose.connection

const userSchema = new Schema({
    username: String,
    password: String
})

const User = mongoose.model('users', userSchema)
const adminUser = new User({
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD
})

User.count({}, (err, count) => {
    if (count === 0) {
        User.insertMany([adminUser])
    }
})