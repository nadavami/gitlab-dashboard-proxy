const express = require('express')
const proxy = require('http-proxy-middleware')

let app = express()

app.use('/gitlab', proxy({
  target: process.env.GITLAB_URL,
  changeOrigin: true,
  pathRewrite: { '^/gitlab': '/' },
  secure: false
}))

module.exports = app
