/* eslint-env jest */
const request = require('supertest')
const nock = require('nock')

// I don't like this.
// This sets the configuration once in app.js. It seems like it could introduce side-effects.
const dummyGitLabEndpoint = 'http://some-gitlab-instance.com'
process.env.GITLAB_URL = dummyGitLabEndpoint

const app = require('../proxy')

describe('Forwards GitLab API Requests', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  test('Can clear entire cache using /cache/clear', async () => {
    let gitlab = nock(dummyGitLabEndpoint)
      .get('/api/v4/projects/123')
      .times(2)
      .reply(200, {msg: 'some content'})
    await request(app).get('/gitlab/api/v4/projects/123')

    let response = await request(app).get('/cache/clear')

    await request(app).get('/gitlab/api/v4/projects/123')

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('all', [])
    expect(gitlab.isDone()).toBe(true)
  })

  test('Can see whats cached using /cache', async () => {
    nock(dummyGitLabEndpoint)
      .get('/api/v4/projects/123')
      .reply(200, {msg: 'some content'})

    await request(app).get('/gitlab/api/v4/projects/123')

    let response = await request(app).get('/cache')

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('groups')
    expect(response.body.groups).toHaveProperty('123')
  })
})
