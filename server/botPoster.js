'use strict'

const ScrapedItem = require('./scrapeSchema')
const Entry = require('./entrySchema')

const post = () => {
    let a = ScrapedItem.aggregate(
       { $sample: { size: 1 } }, (err, res) => {
           res = res[0]
           console.log(res.title)
           let imagesLen = res.imageUrls.length
           let entry = new Entry({
               title: res.title,
               slug: res.title.toLowerCase().split(' ').join('-'),
               type: res.platform,
               imageUrl: `http://mobygames.com${res.imageUrls[Math.floor(Math.random() * imagesLen)]}`,
               body: `<p>${res.title} for <em>${res.platform}</em></p>`
           })
           Entry.insertMany([entry])
       }
    )
    
}

module.exports = {
    post: post
}