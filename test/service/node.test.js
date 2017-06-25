'use strict'

const expect = require('chai').expect

const {Node} = require('../../service')
const utility = require('../lib/utility')
const random = require('../lib/random')

describe('service/node', function () {
  let node

  describe('addNodeAsync', function () {
    it('should add node success', function* () {
      node = yield utility.createTestNodeAsync({isVisible: true})
      expect(node).to.include.keys(['name', 'avatar', 'server', 'method', 'description', 'sort', 'isVisible'])
    })
  })

  describe('getNodeAsync', function () {
    it('should return false if node not found', function* () {
      let tmpNode = yield Node.getAsync(-1)
      expect(tmpNode).to.be.false
    })

    it('should get node success', function* () {
      let tmpNode = yield Node.getAsync(node.nodeId)
      expect(tmpNode.name).to.equal(node.name)
      expect(tmpNode.description).to.equal(node.description)
      expect(tmpNode.isVisible).to.equal(node.isVisible)
    })
  })

  describe('findNodeAsync', function () {
    it('should return node list success', function* () {
      let nodes = yield Node.findAsync()
      expect(nodes.length >= 1).to.be.true
      expect(nodes[0]).to.include.keys(['name', 'avatar', 'server', 'method', 'description', 'sort', 'isVisible'])
    })
  })

  describe('updateNodeAsync', function () {
    it('should return false if node not found', function* () {
      let tmpNode = yield Node.updateAsync(-1)
      expect(tmpNode).to.be.false
    })

    it('should update node success', function* () {
      let name = random.getUserName()
      let tmpNode = yield Node.updateAsync(node.nodeId, {name})
      expect(tmpNode.name).to.equal(name)
      node.name = name
    })
  })

  describe('findNodeUserAsync', function () {
    it('should return user list success', function* () {
      yield Node.findUserAsync(node.nodeId)
    })
  })

  describe('removeNodeAsync', function () {
    it('should return false if node not found', function* () {
      let tmpNode = yield Node.removeAsync(-1)
      expect(tmpNode).to.be.false
    })

    it('should remove node success', function* () {
      yield utility.removeTestNodeAsync(node)
      let tmpNode = yield Node.getAsync(node.nodeId)
      expect(tmpNode).to.be.false
    })
  })

  describe('setNodeStatusAsync', function () {
    it('should set node status success', function* () {
      yield Node.setStatusAsync(node.nodeId, node)
    })
  })

  describe('getNodeStatusAsync', function () {
    it('should get node status success', function* () {
      let tmp = yield Node.getStatusAsync(node.nodeId)
      expect(tmp.name).to.be.equal(node.name)
    })
  })
})
