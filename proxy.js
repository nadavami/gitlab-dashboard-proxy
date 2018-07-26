const express = require('express')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')

const GITLAB_URL = process.env.GITLAB_URL

let app = express()
app.use(bodyParser.json())

let paths = {}

app.post('/update', (req, res, next) => {
  let isPipeline = req.body.object_kind === 'pipeline'
  if (isPipeline) {
    let projectID = req.body.project.id
    Object.keys(paths)
      .filter(key => `/api/v4/projects/${projectID}`.includes(key))
      .forEach(key => delete paths[key])
  }
  res.status(200)
  res.end()
})

app.use('/gitlab', (req, res, next) => {
  let path = req.path.replace(/gitlab\//, '')
  if (path in paths) {
    res.set(paths[path].headers)
    res.end(paths[path].body)
  } else {
    proxy(GITLAB_URL, {
      userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes) => {
        paths[userReq.path] = {}
        paths[userReq.path].headers = headers
        return headers
      },
      userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        paths[userReq.path].body = proxyResData
        return proxyResData
      },
      proxyReqOptDecorator: reqOptions => {
        reqOptions.rejectUnauthorized = false
        return reqOptions
      }
    })(req, res, next)
  }
})
module.exports = app
