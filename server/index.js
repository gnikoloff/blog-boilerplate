'use strict'
const path = require('path')
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
const Entry = require('./entrySchema')
const User = require('./userSchema')

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../client/views'));
app.use(express.static('public'))   
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
    let entries = Entry.find({}, (err, entries) => {
        res.render('index', { entries: entries })
    })
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
    Entry.find({}, (err, entries) => {
        res.render('dashboard', { entries: entries })
    })
})

app.route('/entry/new').get((req, res) => {
    res.render('entry-new', {})
})

app.route('/entry/new').post((req, res) => {
    console.log(req.body)
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

app.route('/entry/:slug').get((req, res) => {
    const slug = req.params.slug
    Entry.find({ slug: slug }, (err, entry) => {
        entry = entry[0]
        res.render('entry', { entry: entry })
    })
})

app.route('/entry/edit/:slug').get((req, res) => {
    const slug = req.params.slug
    Entry.find({ slug: slug }, (err, entry) => {
        entry = entry[0]
        res.render('entry-edit', { entry: entry })
    })
})

app.route('/entry/edit/:slug').post((req, res) => {
    const slug = req.params.slug
    const entry = {
        title: req.body.title,
        slug: req.body.title.toLowerCase().split(' ').join('-'),
        type: req.body.type,
        body: req.body.body
    } 
    Entry.update({ slug: slug }, { $set: entry }, (err, result) => {
        console.log(result)
    })
    console.log(`/entry/${slug}`)
    res.redirect(`/entry/${slug}`)
})

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
})