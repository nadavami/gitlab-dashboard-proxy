const express = require('express')

let app = express()

app.use('/gitlab', (req, res) => {
  res.status(200)
  res.end()
})

module.exports = app
