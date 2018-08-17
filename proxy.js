const express = require('express')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const apicache = require('apicache')
const debug = require('debug')('gitlab-dashboard-proxy')

const GITLAB_URL = process.env.GITLAB_URL

let app = express()
let cache = apicache.middleware

app.post('/update', bodyParser.json(), (req, res, next) => {
  debug('update requested')

  debug('checking if update is for pipeline')
  let isPipeline = req.body.object_kind === 'pipeline'
  if (isPipeline) {
    apicache.clear(req.body.project.id)
    debug(`cleared cache for pipeline ${req.body.project.id}`)
  }
  res.status(200)
  res.end()
})

app.get('/cache', (req, res) => {
  debug('list of cache requested')
  let paths = apicache.getIndex()
  debug(`returning ${paths.all.length} cached paths`)
  res.json(paths)
})

app.get('/cache/clear', (req, res) => {
  debug('cache clear requested')
  res.json(apicache.clear())
  debug('cache cleared manually')
})

app.use('/gitlab/api/v4/projects/:project_id',
  (req, res, next) => {
    debug(`${req.originalUrl} requested`)
    debug(`passing ${req.originalUrl} to cache`)

    res.header('Access-Control-Allow-Headers', 'private-token')
    req.apicacheGroup = req.params.project_id
    next()
  },
  cache('1 hour')
)

app.use('/gitlab', (req, res, next) => {
  debug(`proxying ${req.path}`)
  next()
}, proxy(GITLAB_URL, {
  proxyReqOptDecorator: reqOptions => {
    reqOptions.rejectUnauthorized = false
    return reqOptions
  }
}))

module.exports = app
