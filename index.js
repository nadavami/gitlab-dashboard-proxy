#!/usr/bin/env node

if (!process.env.GITLAB_URL) {
  console.error('Error! GitLab URL is not set.\n')
  console.log('Usage:\n export GITLAB_URL=https://gitlab.com\n gitlab-dashboard-proxy')
  process.exit(1)
}

const app = require('./proxy')
let port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
