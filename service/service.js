'use strict'

const _ = require('lodash')

const User = require('./user')
const Node = require('./node')

// 获取服务列表
exports.findAsync = function* (userId) {
  let user = yield User.getAsync(userId)
  if (!user) {
    return false
  }

  user = _.pick(user, ['port', 'password'])

  let res = []
  let nodes = yield Node.findAsync()
  let filter = ['nodeId', 'name', 'avatar', 'server', 'description', 'method']
  nodes.forEach(function (node) {
    if (node.isVisible) {
      node = _.pick(node, filter)
      Object.assign(node, user)
      res.push(node)
    }
  })

  return res
}

// 获取服务详情
exports.getAsync = function* (userId, nodeId) {
  let user = yield User.getAsync(userId)
  if (!user) {
    return false
  }

  let node = yield Node.getAsync(nodeId)
  if (!node) {
    return false
  }

  return {
    nodeId: node.nodeId,
    name: node.name,
    avatar: node.avatar,
    server: node.server,
    port: user.port,
    method: node.method,
    password: user.password,
    description: node.description
  }
}
