const { expect } = require('chai')

const utils = require('../lib/utils')

describe('/api/services', () => {
  let node
  let user

  before(async () => {
    user = await utils.createTestUserAsync()
    node = await utils.createTestNodeAsync({
      isVisible: true
    })
  })

  after(async () => {
    await utils.removeTestUserAsync(user)
    await utils.removeTestNodeAsync(node)
  })

  describe('list', () => {
    it('should return service list', async () => {
      await request.get('/api/services')
        .use(utils.setUserSession(user))
        .expect(200)
    })
  })

  describe('detail', () => {
    it('should return 404 if service not found', async () => {
      await request.get('/api/services/0')
        .use(utils.setUserSession(user))
        .expect(404)
    })

    it('should return service success', async () => {
      let res = await request.get(`/api/services/${node.nodeId}`)
        .use(utils.setUserSession(user))
        .expect(200)
      expect(res.body.server).equals(node.server)
      expect(res.body.method).equals(node.method)
      expect(res.body.port).equals(user.port)
      expect(res.body.passowrd).equals(user.passowrd)
    })
  })
})
