/* eslint-env jest */
const util = require('util')
const exec = util.promisify(require('child_process').exec)

describe('Can be used as a CLI tool', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  test('Errors when GITLAB_URL is not present', async () => {
    await expect(exec('node index')).rejects.toHaveProperty('stderr', expect.stringMatching(/GitLab URL is not set/))
    await expect(exec('node index')).rejects.toHaveProperty('stdout', expect.stringMatching(/Usage/))
  })
})
