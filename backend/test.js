const puppeteer = require('puppeteer')
const $ = require('cheerio')
const cron = require('node-cron')

let urls = [
  'https://www.reddit.com/r/motivation/',
  'https://www.reddit.com/r/progresspics/',
  'https://www.reddit.com/r/FitnessMotivation/',
  'https://www.reddit.com/r/WholesomeComics/',
  'https://www.reddit.com/r/wholesomepics/',
  'https://www.reddit.com/r/GetMotivated/',
  'https://www.reddit.com/r/QuotesPorn/'
]

let imageURLs = []

const configureBrowser = async (url) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  await page.goto(url)
  return page
}

const fetchURL = async () => {
  console.log('fetchURL starting')
  for (i = 0; i < urls.length; i++) {
    let url = urls[i]
    let page = await configureBrowser(url)
    await page.reload()
    let html = await page.evaluate(() => document.body.innerHTML)
    console.log('fetch starting')
    await page.goto(url)
    let imageURL = await page.$eval(
      '._3Oa0THmZ3f5iZXAQ0hBJ0k img',
      (img) => img.src
    )
    imageURLs[i] = imageURL
    console.log('fetched: ', imageURL)
  }
}
fetchURL()
