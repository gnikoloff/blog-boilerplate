const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 1002
const dbURI = process.env.PROD_MONGODB

const Entry = require('./server/entrySchema')

mongoose.Promise = global.Promise
mongoose.connect(dbURI)

const db = mongoose.connection

db.on('error', console.error.bind(console), 'connection error')
db.once('open', () => {
    console.log('db connected')
})

app.set('view engine', 'pug')

app.route('/').get((req, res) => {
    res.render('index', {})
})

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
})