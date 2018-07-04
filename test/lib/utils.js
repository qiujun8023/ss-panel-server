const _ = require('lodash')

const random = require('./random')
const userService = require('../../src/service/user')
const nodeService = require('../../src/service/node')
const TokenService = require('../../src/service/node_token')

exports.setUserSession = (user) => {
  return (req) => {
    req.set('x-user-id', user.userId)
  }
}

exports.setTokenHeader = (nodeToken) => {
  return (req) => {
    req.set('node-token', nodeToken.token)
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
    location: random.getNodelocation(),
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

exports.createTestNodeTokenAsync = async (opts) => {
  let data = _.assign({
    title: random.getNodeTokenTitle()
  }, opts || {})
  return TokenService.createAsync(data)
}

exports.removeTestNodeTokenAsync = async (nodeToken) => {
  return TokenService.removeAsync(nodeToken.nodeTokenId)
}
