const express = require('express')
const app = express()
const mongoClient = require('mongodb').MongoClient
const PORT = process.env.PORT || 1002

app.set('view engine', 'pug')

app.route('/').get((req, res) => {
    res.render('index', {})
})

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
})