const utils = require('../lib/utils')

describe('/api/traffic', () => {
  let node
  let user

  before(async () => {
    user = await utils.createTestUserAsync({
      isAdmin: true
    })
    node = await utils.createTestNodeAsync()
  })

  after(async () => {
    await utils.removeTestUserAsync(user)
    await utils.removeTestNodeAsync(node)
  })

  describe('stat', () => {
    it('should return user traffic stat', async () => {
      await request.get('/api/traffic/stat')
        .use(utils.setUserSession(user))
        .expect(200)
    })

    it('should return node traffic stat', async () => {
      await request.get('/api/traffic/stat')
        .query({ nodeId: node.nodeId })
        .use(utils.setUserSession(user))
        .expect(200)
    })
  })

  describe('users', () => {
    it('should return users', async () => {
      await request.get('/api/traffic/users')
        .query({ nodeId: node.nodeId })
        .use(utils.setUserSession(user))
        .expect(200)
    })
  })
})
