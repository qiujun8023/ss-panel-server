const { expect } = require('chai')

const utils = require('../lib/utils')
const random = require('../lib/random')
const nodeService = require('../../src/service/node')

describe('service/node', () => {
  let node
  let nodeToken

  describe('createAsync', () => {
    it('should add node success', async () => {
      node = await utils.createTestNodeAsync()
    })
  })

  describe('getAsync', () => {
    it('should return false if node not found', async () => {
      let res = await nodeService.getAsync(-1)
      expect(res).to.equal(null)
    })

    it('should get node success', async () => {
      let res = await nodeService.getAsync(node.nodeId)
      expect(res.name).to.equal(node.name)
      expect(res.description).to.equal(node.description)
      expect(res.isVisible).to.equal(node.isVisible)
    })
  })

  describe('findAsync', () => {
    it('should return node list success', async () => {
      let nodes = await nodeService.findAsync()
      expect(nodes.length >= 1).to.equal(true)
    })
  })

  describe('updateAsync', () => {
    it('should return false if node not found', async () => {
      let res = await nodeService.updateAsync(-1)
      expect(res).to.equal(false)
    })

    it('should update node success', async () => {
      let name = random.getNodeName()
      let res = await nodeService.updateAsync(node.nodeId, { name })
      expect(res.name).to.equal(name)
      node = res
    })
  })

  describe('updateActivedAtAsync', () => {
    it('should return false if node not found', async () => {
      let res = await nodeService.updateActivedAtAsync(-1)
      expect(res).to.equal(false)
    })

    it('should only update node active time', async () => {
      let res = await nodeService.updateActivedAtAsync(node.nodeId)
      expect(res.activedAt).to.not.equal(null)
    })
  })

  describe('genTokenAsync', () => {
    it('should return false if node not found', async () => {
      let res = await nodeService.genTokenAsync(-1)
      expect(res).to.equal(false)
    })

    it('should gen token success', async () => {
      nodeToken = await nodeService.genTokenAsync(node.nodeId)
      expect(nodeToken).to.not.equal(false)
    })
  })

  describe('findTokenAsync', () => {
    it('should return node token list success', async () => {
      let nodeTokens = await nodeService.findTokenAsync({
        nodeId: node.nodeId
      })
      expect(nodeTokens.length >= 1).to.equal(true)
    })
  })

  describe('removeAsync', () => {
    it('should return false if node not found', async () => {
      let res = await nodeService.removeAsync(-1)
      expect(res).to.equal(false)
    })

    it('should remove node success', async () => {
      await utils.removeTestNodeAsync(node)
      let res = await nodeService.getAsync(node.nodeId)
      expect(res).to.equal(null)
    })
  })

  describe('setStatusAsync', () => {
    it('should set node status success', async () => {
      await nodeService.setStatusAsync(node.nodeId, node)
    })
  })

  describe('getStatusAsync', () => {
    it('should return null if status not found', async () => {
      let res = await nodeService.getStatusAsync(-1)
      expect(res).to.be.equal(null)
    })

    it('should get node status success', async () => {
      let res = await nodeService.getStatusAsync(node.nodeId)
      expect(res.name).to.be.equal(node.name)
    })
  })
})
