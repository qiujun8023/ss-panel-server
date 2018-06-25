const redis = require('../lib/redis')
const { Node } = require('../model')

exports.getStatusKey = (nodeId) => {
  return `node:${nodeId}:status`
}

// 获取节点状态（监控用）
exports.getStatusAsync = async (nodeId) => {
  let key = exports.getStatusKey(nodeId)
  let status = await redis.get(key)
  return status ? JSON.parse(status) : null
}

// 设置节点状态（监控用）
exports.setStatusAsync = async (nodeId, status) => {
  let key = exports.getStatusKey(nodeId)
  return redis.set(key, JSON.stringify(status))
}

// 添加节点
exports.createAsync = async (data) => {
  return Node.create(data)
}

// 获取节点
exports.getAsync = async (nodeId) => {
  return Node.findById(nodeId)
}

// 获取节点列表
exports.findAsync = async (where) => {
  return Node.findAll({
    where,
    order: ['sort']
  })
}

// 更新节点
exports.updateAsync = async (nodeId, data) => {
  let node = await Node.findById(nodeId)
  if (!node) {
    return false
  }

  return node.update(data)
}

// 更新节点活跃时间
exports.updateActivedAtAsync = async (nodeId) => {
  let node = await Node.findById(nodeId)
  if (!node) {
    return false
  }

  // 更新活跃时间
  return node.update({
    activedAt: new Date()
  }, {
    silent: true
  })
}

// 删除节点
exports.removeAsync = async (nodeId) => {
  let node = await Node.findById(nodeId)
  if (!node) {
    return false
  }
  return node.destroy()
}
