const redis = require('../lib/redis')
const { Node, NodeToken } = require('../model')

exports.getStatusKey = (nodeId) => {
  return `node:${nodeId}:status`
}

// 获取节点状态（监控用）
exports.getStatusAsync = async (nodeId) => {
  let key = this.getStatusKey(nodeId)
  let status = await redis.get(key)
  return status ? JSON.parse(status) : null
}

// 设置节点状态（监控用）
exports.setStatusAsync = async (nodeId, status) => {
  let key = this.getStatusKey(nodeId)
  return redis.set(key, JSON.stringify(status))
}

// 添加节点
exports.addAsync = async (data) => {
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

// 删除节点
exports.removeAsync = async (nodeId) => {
  let node = await Node.findById(nodeId)
  if (!node) {
    return false
  }
  return node.destroy()
}

// 查询Token
exports.findTokenAsync = async (where) => {
  return NodeToken.find({ where })
}

// 检查 Toekn 是否有效
exports.isTokenValidAsync = async (nodeId, token) => {
  let count = await NodeToken.count({
    where: {
      nodeId,
      token,
      isEnabled: true
    }
  })
  return count === 1
}
