'use strict'
const request = require('request')
const ScrapedItem = require('./scrapeSchema')
const Entry = require('./entrySchema')
const Datauri = require('datauri')

// add twitter facebook posting
const secret = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
}

const twitterPackage = require('twit')
const twitter = new twitterPackage(secret)

const postToTwitter = (entry) => {
    console.log(entry)
    request.get({
        uri: entry.imageUrl,
        encoding: 'base64'
    }, (err, res, body) => {
        twitter.post('media/upload', { media_data: body }, (err, data, response) => {
            var mediaIdStr = data.media_id_string
            var meta_params = { media_id: mediaIdStr, alt_text: { text: 'Retro Image Screen' } }
            twitter.post('media/metadata/create', meta_params, function (err, data, response) {
                if (!err) {
                    let params = { status: `"${entry.title}" for ${entry.type} (${entry.year})`, media_ids: [mediaIdStr] }
                    twitter.post('statuses/update', params)
                }
            })
        })
    })
}

const FB = require('fb')
FB.options({
    accessToken: process.env.FB_ACCESS_TOKEN,
    appId: process.env.FB_APP_ID,
    appSecret: process.env.FB_APP_SECRET,
    version: 'v2.8'
})

const postToFacebook = (entry) => {
    FB.api('me/photos', 'post', {
        url: entry.imageUrl,
        caption: `"${entry.title}" for ${entry.type} (${entry.year})`
    }, (res) => {
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error)
            return;
        }
        console.log('Post Id: ' + res.id)
    })
}

const post = () => {
    let a = ScrapedItem.aggregate(
       { $sample: { size: 1 } }, (err, res) => {
           res = res[0]
           console.log(res.title)
           let imagesLen = res.imageUrls.length
           Entry.find({ title: res.title }, (err, result) => {
               if (result.length === 0) {
                    let entry = new Entry({
                        title: res.title,
                        slug: res.title.toLowerCase().split(' ').join('-'),
                        type: res.platform,
                        year: res.year,
                        imageUrl: `http://mobygames.com${res.imageUrls[Math.floor(Math.random() * imagesLen)]}`,
                        body: `<p>${res.title} for <strong>${res.platform}</strong> (${res.year})</p>`
                    })
                    //postToTwitter(entry)      
                    postToFacebook(entry)
                    Entry.insertMany([entry])    
               }
           })
       }
    )
} 

module.exports = {
    post: post
}