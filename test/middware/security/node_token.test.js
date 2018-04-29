const utils = require('../../lib/utils')

describe('middleware/security/node_token', () => {
  let node
  let nodeToken

  before(async () => {
    node = await utils.createTestNodeAsync()
    nodeToken = await utils.createTestNodeTokenAsync(node)
  })

  after(async () => {
    await utils.removeTestNodeAsync(node)
    await utils.removeTestNodeTokenAsync(nodeToken)
  })

  it('should return false if node not match', async () => {
    await request.get('/api/nodes/-1/users')
      .use(utils.setTokenHeader(nodeToken))
      .expect(401)
  })

  it('should return false if token not match', async () => {
    await request.get(`/api/nodes/${node.nodeId}/users`)
      .use(utils.setTokenHeader({ token: 'invild' }))
      .expect(401)
  })

  it('should return user list success', async () => {
    await request.get(`/api/nodes/${node.nodeId}/users`)
      .use(utils.setTokenHeader(nodeToken))
      .expect(200)
  })
})
