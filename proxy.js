const express = require('express')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const apicache = require('apicache')

const GITLAB_URL = process.env.GITLAB_URL

let app = express()
app.use(bodyParser.json())

let cache = apicache.middleware

app.post('/update', (req, res, next) => {
  let isPipeline = req.body.object_kind === 'pipeline'
  if (isPipeline) {
    apicache.clear(req.body.project.id)
  }
  res.status(200)
  res.end()
})

app.get('/cache', (req, res) => {
  res.json(apicache.getIndex())
})

app.use('/gitlab/api/v4/projects/:project_id', cache('1 hour'), (req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'private-token')
  req.apicacheGroup = req.params.project_id
  next()
})

app.use('/gitlab', proxy(GITLAB_URL, {
  proxyReqOptDecorator: reqOptions => {
    reqOptions.rejectUnauthorized = false
    return reqOptions
  }
}))

module.exports = app
