# gitlab-dashboard-proxy
An event based cache for gitlab dashboards using webhooks.

[![npm version](https://badge.fury.io/js/gitlab-dashboard-proxy.svg)](https://www.npmjs.com/package/gitlab-dashboard-proxy)
[![Build Status](https://travis-ci.org/nadavami/gitlab-dashboard-proxy.svg?branch=master)](https://travis-ci.org/nadavami/gitlab-dashboard-proxy)
[![Coverage Status](https://coveralls.io/repos/github/nadavami/gitlab-dashboard-proxy/badge.svg)](https://coveralls.io/github/nadavami/gitlab-dashboard-proxy)
[![Known Vulnerabilities](https://snyk.io/test/github/nadavami/gitlab-dashboard-proxy/badge.svg?targetFile=package.json)](https://snyk.io/test/github/nadavami/gitlab-dashboard-proxy?targetFile=package.json)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install
Using Yarn:
```bash
yarn global add gitlab-dashboard-proxy
```
Using [Docker](https://hub.docker.com/r/nadavami/gitlab-dashboard-proxy/):
```bash
docker pull nadavami/gitlab-dashboard-proxy
```

## Usage
1. Start gitlab-dashboard-proxy using Yarn:
```bash
export GITLAB_URL=https://gitlab.com
export PORT=8080 # Optional. Default is 3000

gitlab-dashboard-proxy
```
1. Start gitlab-dashboard-proxy using Docker:
```bash
docker run -d -e GITLAB_URL=https://gitlab.com -p 8080:3000 nadavami/gitlab-dashboard-proxy
```
2. Configure your dashboard to use `<gitlab-dashboard-proxy url>/gitlab` instead of GitLab's url.
3. Configure your GitLab project or group to trigger a pipeline event webhook on `<gitlab-dashboard-proxy url>/update`.
4. That's it!

## Routes
- `GET /gitlab` -> Proxies connections to GitLab and caches requests for projects
- `POST /update` -> Clears a single project's cache based on a GitLab pipeline webhook
- `GET /cache` -> Returns a JSON object containing cached paths
- `GET /cache/clear` -> Clears the entire cache

## Q&A
### When would I need this?
We DDoSed our GitLab instance after having many dashboards monitor many pipelines. Just adding a single display that polls every 10s visibly increases server load. This project provides an event based cache to shield GitLab from the large number of API requests.

### Wouldn't it be better to just have an event based pipeline dashboard?
[Yes.](https://github.com/new) 
