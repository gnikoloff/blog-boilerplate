const mongoose = require('mongoose')
const Schema = mongoose.Schema

const scrapeSchema = new Schema({
    title: String,
    platform: String,
    imageUrls: [String]
})

const ScrapedItem = mongoose.model('ScrapedItem', scrapeSchema)

module.exports = ScrapedItem