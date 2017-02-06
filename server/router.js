'use strict'
const express = require('express')
const passport = require('passport')
const Entry = require('./entrySchema')
const bodyParser = require('body-parser')

const urlencodedParser = bodyParser.urlencoded({
    extended: false
})
const router = new express.Router()

router.route('/').get((req, res) => {
    const pageSize = 12
    let pageNum = parseInt(req.query.page) - 1
    if (!pageNum) {
        Entry.count({}, (err, count) => {
            Entry.find({}).limit(pageSize).exec((err, entries) => {
                res.render('index', { entries: entries, pageCount: count })
            })
        })
    } else {
        Entry.count({}, (err, count) => {
            Entry.find({}).limit(pageSize).skip(pageSize * pageNum).exec((err, entries) => {
                res.render('index', { entries: entries, pageCount: count })
            })
        })
    } 
})

router.route('/login').get((req, res) => {
    res.render('login', {})
})

router.post('/login', urlencodedParser, passport.authenticate('local', {successRedirect: '/dashboard', failureRedirect: '/login', failureFlash: true}));

router.route('/dashboard').get((req, res) => {
    const pageSize = 12
    let pageNum = parseInt(req.query.page) - 1
    if (!pageNum) {
        Entry.count({}, (err, count) => {
            Entry.find({}).limit(pageSize).exec((err, entries) => {
                res.render('dashboard', { entries: entries, pageCount: count })
            })
        })
    } else {
        Entry.count({}, (err, count) => {
            Entry.find({}).limit(pageSize).skip(pageSize * pageNum).exec((err, entries) => {
                res.render('dashboard', { entries: entries, pageCount: count })
            })
        })
    } 
})

router.route('/entry/new').get((req, res) => {
    res.render('entry-new', {})
})

router.route('/entry/new').post((req, res) => {
    const dUri = new Datauri()
    dUri.format('.png', req.files.image.data)
    cloudinary.uploader.upload(dUri.content, (result) => {
        const entry = new Entry({
            title: req.body.title,
            slug: req.body.title.toLowerCase().split(' ').join('-'),
            type: req.body.type,
            imageUrl: result.url,
            body: req.body.body
        })
        Entry.insertMany([entry])
        res.redirect('/dashboard')
    })
})

router.route('/entry/:slug').get((req, res) => {
    const slug = req.params.slug
    Entry.find({ slug: slug }, (err, entry) => {
        entry = entry[0]
        res.render('entry', { entry: entry })
    })
})

router.route('/entry/edit/:slug').get((req, res) => {
    const slug = req.params.slug
    Entry.find({ slug: slug }, (err, entry) => {
        entry = entry[0]
        res.render('entry-edit', { entry: entry })
    })
})

router.route('/entry/edit/:slug').post((req, res) => {
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

router.route('/entry/delete/:slug').get((req, res) => {
    const slug = req.params.slug
    Entry.remove({ slug: slug }, (err, result) => {
        res.redirect('/dashboard')
    })
})

module.exports = router