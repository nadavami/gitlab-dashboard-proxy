#!/usr/bin/env node

const app = require('./app/app')
let port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
