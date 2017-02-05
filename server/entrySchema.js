const mongoose = require('mongoose')
const Schema = mongoose.Schema

const entrySchema = new Schema({
    title: String,
    slug: String,
    type: String,
    imageUrl: String,
    body: String
})

const Entry = mongoose.model('Entry', entrySchema)

module.exports = Entry