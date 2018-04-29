const _ = require('lodash')

const userService = require('./user')
const nodeService = require('./node')

const USER_FILTER = ['port', 'password']
const NODE_FILTER = ['name', 'avatar', 'server', 'method', 'description']

// 合并用户与服务信息
exports.mergeService = (user, node) => {
  let userFiltered = _.pick(user, USER_FILTER)
  let nodeFiltered = _.pick(node, NODE_FILTER)
  return Object.assign({ serviceId: node.nodeId }, userFiltered, nodeFiltered)
}

// 获取服务列表
exports.findAsync = async (userId) => {
  let user = await userService.getAsync(userId)
  if (!user) {
    return false
  }

  let res = []
  let nodes = await nodeService.findAsync()
  for (let node of nodes) {
    if (node.isVisible) {
      res.push(exports.mergeService(user, node))
    }
  }

  return res
}

// 获取服务详情
exports.getAsync = async (userId, nodeId) => {
  let user = await userService.getAsync(userId)
  if (!user) {
    return false
  }

  let node = await nodeService.getAsync(nodeId)
  if (!node) {
    return false
  }

  return exports.mergeService(user, node)
}
