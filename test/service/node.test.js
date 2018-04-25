const expect = require('chai').expect

const {Node} = require('../../service')
const utility = require('../lib/utility')
const random = require('../lib/random')

describe('service/node', () => {
  let node

  describe('addAsync', () => {
    it('should add node success', async () => {
      node = await utility.createTestNodeAsync({isVisible: true})
      expect(node).to.include.keys(['name', 'avatar', 'server', 'method', 'description', 'sort', 'isVisible'])
    })
  })

  describe('getAsync', () => {
    it('should return false if node not found', async () => {
      let tmpNode = await Node.getAsync(-1)
      expect(tmpNode).to.be.false
    })

    it('should get node success', async () => {
      let tmpNode = await Node.getAsync(node.nodeId)
      expect(tmpNode.name).to.equal(node.name)
      expect(tmpNode.description).to.equal(node.description)
      expect(tmpNode.isVisible).to.equal(node.isVisible)
    })
  })

  describe('findAsync', () => {
    it('should return node list success', async () => {
      let nodes = await Node.findAsync()
      expect(nodes.length >= 1).to.be.true
      expect(nodes[0]).to.include.keys(['name', 'avatar', 'server', 'method', 'description', 'sort', 'isVisible'])
    })
  })

  describe('updateAsync', () => {
    it('should return false if node not found', async () => {
      let tmpNode = await Node.updateAsync(-1)
      expect(tmpNode).to.be.false
    })

    it('should update node success', async () => {
      let name = random.getUserName()
      let tmpNode = await Node.updateAsync(node.nodeId, {name})
      expect(tmpNode.name).to.equal(name)
      node.name = name
    })
  })

  describe('findUserAsync', () => {
    it('should return user list success', async () => {
      await Node.findUserAsync(node.nodeId)
    })
  })

  describe('removeAsync', () => {
    it('should return false if node not found', async () => {
      let tmpNode = await Node.removeAsync(-1)
      expect(tmpNode).to.be.false
    })

    it('should remove node success', async () => {
      await utility.removeTestNodeAsync(node)
      let tmpNode = await Node.getAsync(node.nodeId)
      expect(tmpNode).to.be.false
    })
  })

  describe('setStatusAsync', () => {
    it('should set node status success', async () => {
      await Node.setStatusAsync(node.nodeId, node)
    })
  })

  describe('getStatusAsync', () => {
    it('should get node status success', async () => {
      let tmp = await Node.getStatusAsync(node.nodeId)
      expect(tmp.name).to.be.equal(node.name)
    })
  })
})
