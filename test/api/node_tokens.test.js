const _ = require('lodash')
const { expect } = require('chai')

const utils = require('../lib/utils')
const random = require('../lib/random')

describe('/api/nodes/token', () => {
  let user
  let node
  let nodeToken

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

  describe('create', () => {
    it('should return 404 if node not exist', async () => {
      let title = random.getNodeTokenTitle()
      await request.post('/api/nodes/-1/tokens')
        .use(utils.setUserSession(user))
        .send({ title })
        .expect(404)
    })

    it('should create node token success', async () => {
      let title = random.getNodeTokenTitle()
      let res = await request.post(`/api/nodes/${node.nodeId}/tokens`)
        .use(utils.setUserSession(user))
        .send({ title })
        .expect(201)

      nodeToken = res.body
      expect(nodeToken.title).to.equal(title)
    })
  })

  describe('detail', () => {
    it('should return 404 if node token not found', async () => {
      await request.get(`/api/nodes/${node.nodeId}/tokens/-1`)
        .use(utils.setUserSession(user))
        .expect(404)
    })

    it('should get node token detail success', async () => {
      await request.get(`/api/nodes/${node.nodeId}/tokens/${nodeToken.nodeTokenId}`)
        .use(utils.setUserSession(user))
        .expect(200)
    })
  })

  describe('list', () => {
    it('should return 404 if node not exist', async () => {
      let title = random.getNodeTokenTitle()
      await request.get('/api/nodes/-1/tokens')
        .use(utils.setUserSession(user))
        .send({ title })
        .expect(404)
    })

    it('should return node token list', async () => {
      let res = await request.get(`/api/nodes/${node.nodeId}/tokens`)
        .use(utils.setUserSession(user))
        .expect(200)

      expect(_.map(res.body, 'nodeTokenId')).to.include(nodeToken.nodeTokenId)
    })
  })

  describe('update', () => {
    it('should return 404 if node token not found', async () => {
      let title = random.getNodeTokenTitle()
      await request.put(`/api/nodes/${node.nodeId}/tokens/-1`)
        .use(utils.setUserSession(user))
        .send({ title })
        .expect(404)
    })

    it('should update node token success', async () => {
      let title = random.getNodeTokenTitle()

      let res = await request.put(`/api/nodes/${node.nodeId}/tokens/${nodeToken.nodeTokenId}`)
        .use(utils.setUserSession(user))
        .send({ title })
        .expect(200)
      expect(res.body.title).to.equal(title)
      nodeToken = res.body
    })
  })

  describe('refresh', () => {
    it('should return 404 if node token not found', async () => {
      let title = random.getNodeTokenTitle()
      await request.post(`/api/nodes/${node.nodeId}/tokens/-1/refresh`)
        .use(utils.setUserSession(user))
        .send({ title })
        .expect(404)
    })

    it('should update node token success', async () => {
      let title = random.getNodeTokenTitle()

      let res = await request.post(`/api/nodes/${node.nodeId}/tokens/${nodeToken.nodeTokenId}/refresh`)
        .use(utils.setUserSession(user))
        .send({ title })
        .expect(200)
      expect(res.body.title).to.equal(nodeToken.title)
      expect(res.body.token).to.not.equal(nodeToken.token)
      nodeToken = res.body
    })
  })

  describe('delete', () => {
    it('should delete node token success', async () => {
      await request.delete(`/api/nodes/${node.nodeId}/tokens/${nodeToken.nodeTokenId}`)
        .use(utils.setUserSession(user))
        .expect(200)

      await request.get(`/api/nodes/${node.nodeId}/tokens/${nodeToken.nodeTokenId}`)
        .use(utils.setUserSession(user))
        .expect(404)
    })
  })
})
