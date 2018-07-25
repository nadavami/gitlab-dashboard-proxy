/* eslint-env jest */
const request = require('supertest')
const nock = require('nock')

// I don't like this.
// This sets the configuration once in app.js. It seems like it could introduce side-effects.
const dummyGitLabEndpoint = 'http://some-gitlab-instance.com'
process.env.GITLAB_URL = dummyGitLabEndpoint

const app = require('../app/app')

describe('Forwards GitLab API Requests', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  test('Can invalidate cache using /update', async () => {
    let gitlab = nock(dummyGitLabEndpoint)
      .get('/api/v4/projects/123')
      .times(2)
      .reply(200, {msg: 'some content'})
    await request(app).get('/gitlab/api/v4/projects/123')

    let webhookResponse = await request(app)
      .post('/update')
      .send({
        object_kind: 'pipeline',
        project: { id: 123 }
      })

    await request(app).get('/gitlab/api/v4/projects/123')

    expect(webhookResponse.statusCode).toBe(200)
    expect(gitlab.isDone()).toBe(true)
  })

  test('Fail happy if /update is invalid', async () => {
    let response = await request(app).post('/update')
    expect(response.statusCode).toBe(200)
  })
})
