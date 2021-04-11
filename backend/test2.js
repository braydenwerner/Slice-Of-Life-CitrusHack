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
  'Everything is going to be okay.',
  'Breathe.',
  'Your strength defines you!',
  'Just be yourself!',
  'Choose happiness.',
  'You matter.',
  'You deserve love.',
  'You got this!'
]

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Push Notification Server Running')
})

app.get('/getImageUrl', (req, res) => {
  res.send(imageURL)
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

let url = 'https://www.reddit.com/r/wholesomememes/'
let imageURL = 'test_thing'

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
  let page = await configureBrowser(url)
  await page.reload()
  let html = await page.evaluate(() => document.body.innerHTML)
  console.log('fetch starting')
  await page.goto(url)
  imageURL = await page.$eval('._3Oa0THmZ3f5iZXAQ0hBJ0k img', (img) => img.src)
  console.log('fetched: ', imageURL)
}
fetchURL()
