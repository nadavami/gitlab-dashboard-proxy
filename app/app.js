const express = require('express')
const bodyParser = require('body-parser')
const proxy = require('http-proxy-middleware')
const request = require('request-promise')

const GITLAB_URL = process.env.GITLAB_URL
let projects = {}

let app = express()
app.use(bodyParser.json())

app.post('/pipeline', async (req, res) => {
  let isPipeline = req.body.object_kind === 'pipeline'
  if (isPipeline) {
    let pipelineID = req.body.object_attributes.id
    let projectID = req.body.project.id
    projects[projectID] = await request(`${GITLAB_URL}/api/v4/projects/${projectID}/pipelines`).catch(console.error)
    projects[projectID][pipelineID] = await request(`${GITLAB_URL}/api/v4/projects/${projectID}/pipelines/${pipelineID}`).catch(console.error)
    res.status(200)
  } else {
    res.status(500)
  }
  res.end()
})

app.use('/gitlab', proxy({
  target: GITLAB_URL,
  changeOrigin: true,
  pathRewrite: { '^/gitlab': '/' },
  secure: false
}))

module.exports = app
