/* eslint-env jest */
const request = require('supertest')
const app = require('../app')

describe('Forwards GitLab API Requests', () => {
  test('Can capture all requests on /gitlab/', async () => {
    let response = await request(app).get('/gitlab/api/v4/projects/')
    expect(response.statusCode).toBe(200)
  })
})
