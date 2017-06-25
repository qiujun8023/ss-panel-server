'use strict'

const _ = require('lodash')

const random = require('./random')
const {User, Node} = require('../../service')

let ss = module.exports = {}

ss.createTestUserAsync = function* (opts) {
  let data = _.assign({
    userId: random.getUserId(),
    name: random.getUserName()
  }, opts || {})

  return yield User.createAsync(data)
}

ss.removeTestUserAsync = function* (user) {
  return yield User.removeAsync(user.userId)
}

ss.createTestNodeAsync = function* (opts) {
  let data = _.assign({
    name: random.getNodeName(),
    avatar: random.getNodeAvatar(),
    server: random.getNodeServer(),
    method: random.getNodeMethod(),
    description: random.getNodeDescription(),
    sort: random.getNodeSort(),
    isVisible: random.getNodeIsVisible()
  }, opts || {})

  return yield Node.addAsync(data)
}

ss.removeTestNodeAsync = function* (node) {
  return yield Node.removeAsync(node.nodeId)
}
