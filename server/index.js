'use strict'
const path = require('path')
const express = require('express')
const app = express()
const compression = require('compression')
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const cloudinary = require('cloudinary')
const fileUpload = require('express-fileupload')
const Datauri = require('datauri')

const PORT = process.env.PORT || 1002
const dbURI = process.env.PROD_MONGODB

mongoose.Promise = global.Promise
mongoose.connect(dbURI)
const db = mongoose.connection
db.on('error', console.error.bind(console), 'connection error')

const passport = require('passport')
const User = require('./userSchema')

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../client/views'));
app.use(compression())
app.use(express.static('public'))   
app.use(cookieParser('keyboard_cat'))
app.use(bodyParser.json())
app.use(fileUpload())
app.use(bodyParser.urlencoded({
    extended: false
}))

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(require('express-session')({
    secret: 'keyboard_cat',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(require('./router'))
require('./scraper')

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
})