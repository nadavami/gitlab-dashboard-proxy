/* eslint-env jest */
const request = require('supertest')
const nock = require('nock')

// I don't like this.
// This sets the configuration once in app.js. It seems like it could introduce side-effects.
const dummyGitLabEndpoint = 'http://some-gitlab-instance.com'
process.env.GITLAB_URL = dummyGitLabEndpoint

const app = require('../app/app')

afterEach(() => {
  nock.cleanAll()
})

describe('Forwards GitLab API Requests', () => {
  test('Can forward /gitlab/ requests to GitLab', async () => {
    let gitlab = nock(dummyGitLabEndpoint).get('/api/v4/projects/').reply(200, {msg: 'some content'})

    let response = await request(app).get('/gitlab/api/v4/projects/')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({msg: 'some content'})
    expect(gitlab.isDone()).toBe(true)
  })
})

describe('Listens to pipeline webhooks', () => {
  test('Can get pipline details  on /pipeline webhook from GitLab', async () => {
    let gitlab = nock(dummyGitLabEndpoint)
      .get('/api/v4/projects/123/pipelines')
      .reply(200)
      .get('/api/v4/projects/123/pipelines/456')
      .reply(200)

    let response = await request(app)
      .post('/pipeline')
      .send({
        object_kind: 'pipeline',
        object_attributes: { id: 456 },
        project: { id: 123 }
      })
    expect(response.statusCode).toBe(200)
    expect(gitlab.isDone()).toBe(true)
  })

  test('Invalid /pipeline webhook returns 500 error', async () => {
    let response = await request(app)
      .post('/pipeline')
      .send({})
    expect(response.statusCode).toBe(500)
  })
})
