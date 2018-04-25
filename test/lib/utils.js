const _ = require('lodash')

const random = require('./random')
const userService = require('../../src/service/user')
const nodeService = require('../../src/service/node')

exports.setUserSession = (user) => {
  return (req) => {
    req.set('x-user-id', user.userId)
  }
}

exports.createTestUserAsync = async (opts) => {
  let data = _.assign({
    username: random.getUsername(),
    nickname: random.getNickname()
  }, opts || {})

  return userService.createAsync(data)
}

exports.removeTestUserAsync = async (user) => {
  return userService.removeAsync(user.userId)
}

exports.createTestNodeAsync = async (opts) => {
  let data = _.assign({
    name: random.getNodeName(),
    avatar: random.getNodeAvatar(),
    server: random.getNodeServer(),
    method: random.getNodeMethod(),
    description: random.getNodeDescription(),
    sort: random.getNodeSort(),
    isVisible: random.getNodeIsVisible()
  }, opts || {})

  return nodeService.createAsync(data)
}

exports.removeTestNodeAsync = async (node) => {
  return nodeService.removeAsync(node.nodeId)
}
