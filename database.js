const { Pool } = require('pg')
const { v4: uuidv4 } = require('uuid')

const config = {
  user: 'brayden',
  password: 'test12345678',
  host: 'free-tier.gcp-us-central1.cockroachlabs.cloud',
  database: 'nutty-shark-1721.defaultdb',
  port: 26257,
  ssl: {
    rejectUnauthorized: false
  }
}

async function retryTxn(n, max, client, operation, callback) {
  await client.query('BEGIN;')
  while (true) {
    n++
    if (n === max) {
      throw new Error('Max retry count reached.')
    }
    try {
      await operation(client, callback)
      await client.query('COMMIT;')
      return
    } catch (err) {
      if (err.code !== '40001') {
        return callback(err)
      } else {
        console.log('Transaction failed. Retrying transaction.')
        console.log(err.message)
        await client.query('ROLLBACK;', () => {
          console.log('Rolling back transaction.')
        })
        await new Promise((r) => setTimeout(r, 2 ** n * 1000))
      }
    }
  }
}

const pool = new Pool(config)

let client
let title
let description
let id
let response = []

const callback = (err, res) => {
  response = []
  if (err) {
    console.log(err)
    return
  }

  if (res.rows.length > 0) {
    res.rows.forEach((row) => {
      response.push(row)
    })
  }
}

const getPosts = async () => {
  const getAllPostsQuery = 'SELECT * FROM posts;'
  await client.query(getAllPostsQuery, callback)
}

const addPost = async () => {
  const addPostQuery = `INSERT INTO posts (id, title, description, upvotes, downvotes) VALUES ('${uuidv4()}','${title}','${description}', 0, 0);`
  await client.query(addPostQuery, callback)
}

const deletePost = async () => {
  const deletePostQuery = `DELETE FROM posts WHERE id='${id}'`
  await client.query(deletePostQuery, callback)
}

const upvotePost = async () => {
  const upvotePostQuery = `UPDATE posts SET upvotes = upvotes + 1 WHERE id='${id}';`
  await client.query(upvotePostQuery, callback)
}

const removeUpvote = async () => {
  const removeUpvoteQuery = `UPDATE posts SET upvotes = upvotes - 1 WHERE id='${id}';`
  await client.query(removeUpvoteQuery, callback)
}

const downvotePost = async () => {
  const downvotePostQuery = `UPDATE posts SET downvotes = downvotes + 1 WHERE id='${id}';`
  await client.query(downvotePostQuery, callback)
}

const removeDownvote = async () => {
  const removeDownvoteQuery = `UPDATE posts SET downvotes = downvotes - 1 WHERE id='${id}';`
  await client.query(removeDownvoteQuery, callback)
}

const initAddPost = async (p) => {
  title = p.title
  description = p.description
  await retryTxn(0, 15, client, addPost, callback)
}
const initDeletePost = async (i) => {
  id = i
  await retryTxn(0, 15, client, deletePost, callback)
}

const initUpvotePost = async (i) => {
  id = i
  await retryTxn(0, 15, client, upvotePost, callback)
}

const initRemoveUpvote = async (i) => {
  id = i
  await retryTxn(0, 15, client, removeUpvote, callback)
}

const initDownvotePost = async (i) => {
  id = i
  await retryTxn(0, 15, client, downvotePost, callback)
}

const initRemoveDownvote = async (i) => {
  id = i
  await retryTxn(0, 15, client, removeDownvote, callback)
}

const initGetPosts = async () => {
  await retryTxn(0, 15, client, getPosts, callback)
  return response
}

const initDB = async () => {
  client = await pool.connect()
}
initDB()

module.exports = {
  initDB,
  initGetPosts,
  initAddPost,
  initDeletePost,
  initUpvotePost,
  initRemoveUpvote,
  initDownvotePost,
  initRemoveDownvote
}
