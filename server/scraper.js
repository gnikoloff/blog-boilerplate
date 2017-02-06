'use strict'
const request = require('request')
const cheerio = require('cheerio')
const ScrapedItem = require('./scrapeSchema')

const rootURL = 'http://mobygames.com'

let activePageNum = 0
let pageCount = 15

const scrapePages = (pageNum) => {

    const getScreenShot = (err, res, body) => {
        let $ = cheerio.load(body)
        let image = $('#main .col-md-12 .screenshot-holder .screenshot img')
        let imageUrl = image.attr('src')
        links.push(imageUrl)
        if (n === thumbsLength - 1) {
            let entry = new ScrapedItem({
                title: title,
                platform: 'Sega Dreamcast',
                imageUrls: links
            })
            console.log(`Inserted ${entry.title} for ${entry.platform} at position ${i}`)
            ScrapedItem.insertMany([entry])
        }
    }

    const openScreenshotPage = (err, res, body) => {
        if (err) throw err
        let $ = cheerio.load(body)
        let thumbnailContainers = $('#wrapper #main .col-md-12 .row .col-xs-6')
        let pageExists = thumbnailContainers.length !== 0 ? true : false
        let links = []
        if (pageExists) {
            let thumbsLength = thumbnailContainers.length
            thumbnailContainers.each((n, thumbnail) => {
                let link = `${rootURL}${$(thumbnail).find('a').attr('href')}`
                request(link, getScreenShot)
                //links.push(link)
            })
        }
    }

    const scrapeListItem = (i, val) => {
        let link = `${rootURL}${$(val).attr('href')}/screenshots`
        let title = $(val).text()
        request(link, openScreenshotPage)
    }

    request(
        `${rootURL}/browse/games/dreamcast/offset,${pageNum * 25}/so,0a/list-games/`,
        (err, res, body) => {
            if (err) throw err
            let $ = cheerio.load(body)
            let listItems = $('#main #mof_object_list tbody tr td:first-of-type a')
            let listItemsLen = listItems.length
            console.log(`#${pageNum} page opened`)
            listItems.each(scrapeListItem)
        }
    )
}

const onInterval = () => {
    scrapePages(activePageNum)
    activePageNum += 1
    if (activePageNum === 13) {
        clearInterval(interval)
        console.log('scrapig finished')
    }
}
onInterval()
let interval = setInterval(onInterval, 15 * 1000)