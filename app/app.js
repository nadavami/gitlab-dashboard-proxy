const express = require('express')
const proxy = require('express-http-proxy')

const GITLAB_URL = process.env.GITLAB_URL

let app = express()

app.use('/gitlab', proxy(GITLAB_URL, {
  proxyReqOptDecorator: reqOptions => {
    reqOptions.rejectUnauthorized = false
    return reqOptions
  }
}))

module.exports = app
