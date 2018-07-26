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

  test('Can forward /gitlab/ requests to GitLab', async () => {
    let gitlab = nock(dummyGitLabEndpoint)
      .get('/api/v4/projects/')
      .reply(200, {msg: 'some content'})

    let response = await request(app).get('/gitlab/api/v4/projects/')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({msg: 'some content'})
    expect(gitlab.isDone()).toBe(true)
  })

  test('Can cache requests to GitLab', async () => {
    let gitlab = nock(dummyGitLabEndpoint)
      .get('/api/v4/projects/')
      .times(2)
      .reply(200, {msg: 'some content'})

    await request(app).get('/gitlab/api/v4/projects/')
    let response = await request(app).get('/gitlab/api/v4/projects/')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({msg: 'some content'})
    expect(gitlab.isDone()).toBe(false)
  })
})
