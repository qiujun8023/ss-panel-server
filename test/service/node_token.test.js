const { expect } = require('chai')

const utils = require('../lib/utils')
const random = require('../lib/random')
const tokenService = require('../../src/service/node_token')

describe('service/node_token', () => {
  let node
  let nodeToken

  before(async () => {
    node = await utils.createTestNodeAsync({ isVisible: true })
  })

  after(async () => {
    await utils.removeTestNodeAsync(node)
  })

  describe('createAsync', () => {
    it('should create token success', async () => {
      let title = random.getNodeTokenTitle()
      nodeToken = await tokenService.createAsync({
        nodeId: node.nodeId,
        title
      })
      expect(nodeToken).to.not.equal(false)
    })

    it('should create token success', async () => {
      let title = random.getNodeTokenTitle()
      let token = await tokenService.genAsync()
      nodeToken = await tokenService.createAsync({
        nodeId: node.nodeId,
        title,
        token
      })
      expect(nodeToken).to.not.equal(false)
    })
  })

  describe('getAsync', () => {
    it('should return node token success', async () => {
      let res = await tokenService.getAsync(nodeToken.nodeTokenId)
      expect(res.token).to.equal(nodeToken.token)
    })
  })

  describe('findAsync', () => {
    it('should return node token list success', async () => {
      let nodeTokens = await tokenService.findAsync({
        nodeId: node.nodeId
      })
      expect(nodeTokens.length >= 1).to.equal(true)
    })
  })

  describe('updateAsync', () => {
    it('should return false if node not found', async () => {
      let res = await tokenService.updateAsync(-1)
      expect(res).to.equal(false)
    })

    it('should update node success', async () => {
      let token = await tokenService.genAsync()
      let res = await tokenService.updateAsync(nodeToken.nodeTokenId, { token })
      expect(res.token).to.equal(token)
      nodeToken = res
    })
  })

  describe('isValidAsync', () => {
    it('should return false if token not found', async () => {
      let res = await tokenService.isValidAsync(node.nodeId, 'invaild token')
      expect(res).to.equal(false)
    })

    it('should return true and update active time if token is vaild', async () => {
      let res1 = await tokenService.isValidAsync(node.nodeId, nodeToken.token)
      let res2 = await tokenService.findAsync({
        nodeId: node.nodeId,
        token: nodeToken.token
      })
      expect(res1).to.equal(true)
      expect(res2[0].activedAt).to.not.equal(null)
    })
  })

  describe('removeAsync', () => {
    it('should return false if node token not found', async () => {
      let res = await tokenService.removeAsync(-1)
      expect(res).to.equal(false)
    })

    it('should remove node success', async () => {
      await tokenService.removeAsync(nodeToken.nodeTokenId)
      let res = await tokenService.findAsync({
        nodeId: node.nodeId,
        token: nodeToken.token
      })
      expect(res.length).to.equal(0)
    })
  })
})
