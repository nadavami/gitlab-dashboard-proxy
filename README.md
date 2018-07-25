# gitlab-dashboard-proxy
An event based cache for gitlab dashboards using webhooks.

[![Build Status](https://travis-ci.org/nadavami/gitlab-dashboard-proxy.svg?branch=master)](https://travis-ci.org/nadavami/gitlab-dashboard-proxy)
[![Coverage Status](https://coveralls.io/repos/github/nadavami/gitlab-dashboard-proxy/badge.svg)](https://coveralls.io/github/nadavami/gitlab-dashboard-proxy)

## Q&A
##### When would I need this?
We DDoSed our GitLab instance after having many dashboards monitor many pipelines. Just adding a single display that polls every 10s visibly increases server load. This project provides an event based cache to shield GitLab from the large number of API requests.

##### Wouldn't it be better to just have an event based pipeline dashboard?
[Yes.](https://github.com/new) 
