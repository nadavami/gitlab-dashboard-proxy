const express = require('express')
const proxy = require('express-http-proxy')

const GITLAB_URL = process.env.GITLAB_URL

let app = express()
let paths = {}

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
