const express = require('express')
const axios = require('axios')
const { Expo } = require('expo-server-sdk')
const app = express()
const expo = new Expo()
const cors = require('cors')
const puppeteer = require('puppeteer')
const $ = require('cheerio')
const cron = require('node-cron')

const database = require('./database')

app.use(cors())

//  cockroach database
const initDB = async () => await database.initDB()
initDB()

// let url = 'https://www.reddit.com/r/wholesomememes/'
// let imageURL = ''

let savedData = []
const PORT = process.env.PORT || 3000

const motivationNotifications = [
  'You can do it!',
  'You are awesome!',
  'Breathe.',
  'Your strength defines you!',
  'Just be yourself!',
  'You got this!',
  'Believe in yourself'
]

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Push Notification Server Running')
})

app.get('/getImageUrls', (req, res) => {
  res.send(imageURLs)
})

app.post('/data', (req, res) => {
  saveData(req.body)
  res.send('/data endpoint reached')
})

app.post('/sendNotifications', (req, res) => {
  sendNotifications()
  res.send('/sendNotifications endpoint reached')
})

app.get('/getPosts', async (req, res) => {
  const posts = await database.initGetPosts()
  res.send(posts)
})

app.post('/deletePost', async (req, res) => {
  console.log('/deletePost post request: ', req.body)
  if (req.body.id) await database.initDeletePost(req.body.id)
  res.send('Received id: ' + req.body.id)
})

app.post('/addPost', async (req, res) => {
  console.log('Received post request: ', req.body)
  if (
    req.body &&
    req.body.title !== undefined &&
    req.body.description !== undefined
  )
    await database.initAddPost(req.body)
  res.send('Received message: ' + req.body)
})

app.post('/upvotePost', async (req, res) => {
  console.log('Received post request: ', req.body.id)
  if (req.body.id) await database.initUpvotePost(req.body.id)
  res.send('Received message: ' + req.body.id)
})

app.post('/removeUpvote', async (req, res) => {
  console.log('Received post request: ', req.body.id)
  if (req.body.id) await database.initRemoveUpvote(req.body.id)
  res.send('Received message: ' + req.body.id)
})

app.post('/downvotePost', async (req, res) => {
  console.log('Received post request: ', req.body.id)
  if (req.body.id) await database.initDownvotePost(req.body.id)
  res.send('Received message: ' + req.body.id)
})

app.post('/removeDownvote', async (req, res) => {
  console.log('Received post request: ', req.body.id)
  if (req.body.id) await database.initRemoveDownvote(req.body.id)
  res.send('Received message: ' + req.body.id)
})

app.listen(PORT, () => {
  console.log(`Server Online on Port ${PORT}`)
})

const sendNotifications = () => {
  let notifications = []
  for (let data of savedData) {
    if (!Expo.isExpoPushToken(data.token)) {
      console.error(`Push token ${data.token} is not a valid Expo push token`)
      continue
    }

    notifications.push({
      to: data.token,
      sound: 'default',
      title:
        motivationNotifications[
          Math.floor(Math.random() * motivationNotifications.length)
        ],
      body: '',
      data: {}
    })

    //  send notifications based on notifications array
    let chunks = expo.chunkPushNotifications(notifications)
    ;(async () => {
      for (let chunk of chunks) {
        try {
          let receipts = await expo.sendPushNotificationsAsync(chunk)
          console.log(receipts)
        } catch (error) {
          console.error(error)
        }
      }
    })()
  }
}
//  send notification every minute to all users
setInterval(sendNotifications, 60000)

const saveData = (data) => {
  let existingIdx = savedData.findIndex((d) => d.token === data.token)
  if (existingIdx === -1) savedData.push(data)
  else savedData[existingIdx] = { ...data }
}

let urls = [
  'https://www.reddit.com/r/motivation/',
  'https://www.reddit.com/r/progresspics/',
  'https://www.reddit.com/r/FitnessMotivation/',
  'https://www.reddit.com/r/WholesomeComics/',
  'https://www.reddit.com/r/wholesomepics/',
  'https://www.reddit.com/r/GetMotivated/',
  'https://www.reddit.com/r/QuotesPorn/'
]

let imageURLs = [
  'https://preview.redd.it/cqr1ionccfs61.jpg?width=640&crop=smart&auto=webp&s=8d2e9578e90617848a91dedfbd07868ee19d74b6',
  'https://preview.redd.it/lknoen22bes61.png?width=640&crop=smart&auto=webp&s=cb72747f52c91ef2231ccbf3c49bd5ff85fca33b',
  'https://preview.redd.it/67aqgp6mrds61.jpg?width=640&crop=smart&auto=webp&s=c27e5852806059987bf8eb2e6a744c6843477def',
  'https://preview.redd.it/y9zun1b93as61.jpg?width=640&crop=smart&auto=webp&s=fd7417de1f0f1e4ce9f32802d9b754c21eb92341',
  'https://preview.redd.it/jh60lpklhes61.jpg?width=640&crop=smart&auto=webp&s=0dca657a562532483fc686bdfcf8aefa0ef6fa22',
  'https://preview.redd.it/8tcmvfyjtas61.png?width=640&crop=smart&auto=webp&s=9825444fa6477fe491574188e2e941e0af4a8fb8',
  'https://preview.redd.it/2xod7wqep5s61.jpg?width=640&crop=smart&auto=webp&s=96071d47f3d904f7b6f41143cdc858ba4e7f8d0c',
  'https://i.redd.it/gdrlywqryds61.jpg',
  'https://preview.redd.it/3vdf5zay3cs61.jpg?width=640&crop=smart&auto=webp&s=7b682d05ce13ba1fe074cbecc753a7d9ad0c39f8',
  'https://preview.redd.it/qa1cvfbhocs61.jpg?width=640&crop=smart&auto=webp&s=e7e53ffb24c7da274fce7fe6e2ed63848cea1c29'
]

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
    imageURLs[i + 10] = imageURL
    console.log('fetched: ', imageURL)
  }
}
fetchURL()
