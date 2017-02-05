const mongoose = require('mongoose')
const { Schema } = mongoose

const entrySchema = new Schema({
    title: String,
    type: String,
    imageUrl: String,
    body: String
})

const Entry = mongoose.model('Entry', entrySchema)

module.exports = Entry