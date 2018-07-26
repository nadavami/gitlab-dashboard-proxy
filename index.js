#!/usr/bin/env node

const app = require('./app/app')
let port = process.env.PORT || 3000

if (!process.env.GITLAB_URL) {
  console.error('Error! GitLab URL is not set.\n')
  console.log('Usage:\n export GITLAB_URL=https://gitlab.com\n gitlab-dashboard-proxy')
  process.exit(1)
}

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
