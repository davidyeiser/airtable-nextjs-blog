// Access .env variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const next = require('next')
const cache = require('./cache')

const Airtable = require('airtable')
Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY })

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const app = next({ dev })
const handle = app.getRequestHandler()

// Markdown support for JSON feed
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()

const serialize = data => JSON.stringify({ data })

/* Main Airtable Query */
const getAirtablePosts = (baseId) => {
  const base = new Airtable.base(baseId)

  return new Promise((resolve, reject) => {
    cache.get('airtablePosts', function(error, data) {
      if (error) throw error

      if (!!data) {
        // Stored value, grab from cache
        resolve(JSON.parse(data))
      }
      else {
        // No stored value, retrieve from Airtable
        const storeAirtablePosts = []

        // Query
        const apiQuery = {
          pageSize: 50,
          sort: [{field: 'Publish Date', direction: 'desc'}]
        }

        // Go get it!
        base('Posts').select(apiQuery).eachPage((records, fetchNextPage) => {
          // This function (`page`) will get called for each page of records.

          // The properties here would correspond to your records
          records.forEach(function(record) {
            const post = {
              title: record.get('Title'),
              content: record.get('Content'),
              publish_date: record.get('Publish Date'),
              slug: record.get('Slug'),
              id: record.id
            }

            storeAirtablePosts.push(post)
          })

          fetchNextPage()
        }, function done(error) {
          if (error) reject({ error })

          // Store results in Redis, expires in 30 sec
          cache.setex('airtablePosts', 30, JSON.stringify(storeAirtablePosts))

          // Finish
          resolve(storeAirtablePosts)
        })
      }
    })
  })
}

/* Get Individual Airtable Record */
const getAirtablePost = (recordId, baseId) => {
  const base = new Airtable.base(baseId)
  const cacheRef = '_cachedAirtableBook_'+recordId

  return new Promise((resolve, reject) => {
    cache.get(cacheRef, function(error, data) {
      if (error) throw error

      if (!!data) {
        // Stored value, grab from cache
        resolve(JSON.parse(data))
      }
      else {
        base('Posts').find(recordId, function(err, record) {
          if (err) {
            console.error(err)
            reject({ err })
          }

          const airtablePost = {
            title: record.get('Title'),
            content: record.get('Content'),
            publish_date: record.get('Publish Date')
          }

          // Store results in Redis, expires in 30 sec
          cache.setex(cacheRef, 30, JSON.stringify(airtablePost));

          resolve(airtablePost)
        })
      }
    })
  })
}

app.prepare()
  .then(() => {
    const server = express()

    // Internal API call to get Airtable data
    server.get('/api/get/posts', (req, res) => {
      Promise.resolve(getAirtablePosts(process.env.AIRTABLE_BASE_ID)).then(data => {
        res.writeHead(200, {'Content-Type': 'application/json'})
        return res.end(serialize(data))
      }).catch((error) => {
        console.log(error)
        // Send empty JSON otherwise page load hangs indefinitely
        res.writeHead(200, {'Content-Type': 'application/json'})
        return res.end(serialize({}))
      })
    })

    // Internal API call to get individual Airtable post
    server.get('/api/post/:id', (req, res) => {
      Promise.resolve(getAirtablePost(req.params.id, process.env.AIRTABLE_BASE_ID)).then(data => {
        res.writeHead(200, {'Content-Type': 'application/json'})
        return res.end(serialize(data))
      }).catch((error) => {
        console.log(error)
        // Send empty JSON otherwise page load hangs indefinitely
        res.writeHead(200, {'Content-Type': 'application/json'})
        return res.end(serialize({}))
      })
    })

    // JSON Feed
    server.get('/feed/json', (req, res) => {
      Promise.resolve(getAirtablePosts(process.env.AIRTABLE_BASE_ID)).then(data => {
        const jsonFeed = {
          "version": "https://jsonfeed.org/version/1",
          "home_page_url": "https://yourdomain.com/",
          "feed_url": "https://yourdomain.com/feed/json",
          "title": "YOUR SITE TITLE",
          "description": "YOUR SITE DESCRIPTION",
          "items": [
          ]
        }

        // Go through each item in returned array and add it to our JSON Feed object
        data.map((item) => {
          jsonFeed.items.push({
            "id": `https://yourdomain.com/post/${item.id}/${item.slug}`,
            "url": `https://yourdomain.com/post/${item.id}/${item.slug}`,
            "title": item.title,
            "content_html": !!item.content ? md.render(item.content) : '',
            "date_published": item.publish_date,
            "author": {
              "name": "YOUR NAME"
            }
          })
        })

        res.writeHead(200, {'Content-Type': 'application/json'})
        return res.end(JSON.stringify(jsonFeed, null, 2))
      }).catch((error) => {
        console.log(error)
        // Send empty JSON otherwise page load hangs indefinitely
        res.writeHead(200, {'Content-Type': 'application/json'})
        return res.end(serialize({}))
      })
    })

    server.get('/post/:id/:slug', (req, res) => {
      const actualPage = '/single'

      const queryParams = {
        id: req.params.id,
        slug: req.params.slug
      }

      app.render(req, res, actualPage, queryParams)
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
