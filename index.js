'use strict'
const express = require('express')
const app = express()
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const PORT = process.env.PORT || 1002
const dbURI = process.env.PROD_MONGODB

mongoose.Promise = global.Promise
mongoose.connect(dbURI)

const db = mongoose.connection

db.on('error', console.error.bind(console), 'connection error')
//db.once('open', () => {
//    console.log('db connected')
//})


const passport = require('passport')
const Entry = require('./server/entrySchema')
const User = require('./server/userSchema')

app.set('view engine', 'pug')   
app.use(cookieParser('keyboard_cat'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
const urlencodedParser = bodyParser.urlencoded({
    extended: false
})

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

app.route('/').get((req, res) => {
    res.render('index', {})
})

app.route('/login').get((req, res) => {
    res.render('login', {})
})

app.post('/login', (req, res, next) => {
    console.log(req.body)
    next()
})
app.post('/login', urlencodedParser, passport.authenticate('local', {successRedirect: '/dashboard', failureRedirect: '/login', failureFlash: true}));

app.route('/dashboard').get((req, res) => {
    let entries = Entry.find({}, (err, entries) => {
        res.render('dashboard', { entries: entries })
    })
})

app.route('/dashboard/new').get((req, res) => {
    res.render('new-post', {})
})

app.route('/dashboard/new').post((req, res) => {
    const entry = new Entry({
        title: req.body.title,
        slug: req.body.title.toLowerCase().split(' ').join('-'),
        type: req.body.type,
        imageUrl: 's',
        body: req.body.body
    })
    Entry.insertMany([entry])
    res.redirect('/dashboard')
})

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
})