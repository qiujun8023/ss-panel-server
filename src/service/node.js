const _ = require('lodash')
const Sequelize = require('sequelize')

const utils = require('../lib/utils')
const redis = require('../lib/redis')
const sequelize = require('../lib/sequelize')
const { Node, NodeToken } = require('../model')

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

// 生成Token
exports.genTokenAsync = async (nodeId) => {
  let node = await Node.findById(nodeId)
  if (!node) {
    return false
  }

  // 创建事物
  let transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  })

  // 生成 Token
  let nodeToken
  let nodeTokens = await NodeToken.findAll({ transaction })
  let tokens = _.map(nodeTokens, 'token')
  for (let i = 0; i < 5; i++) {
    let token = utils.randomString(32)
    if (tokens.indexOf(token) === -1) {
      nodeToken = await node.createToken({ token }, { transaction })
      break
    }
  }

  await transaction.commit()
  return nodeToken || false
}

// 查询Token
exports.findTokenAsync = async (where) => {
  return NodeToken.findAll({ where })
}

// 检查 Toekn 是否有效并更新活跃时间
exports.isTokenValidAsync = async (nodeId, token) => {
  let nodeToken = await NodeToken.findOne({
    where: {
      nodeId,
      token,
      isEnabled: true
    }
  })
  if (!nodeToken) {
    return false
  }

  // 更新活跃时间
  await nodeToken.update({
    activedAt: new Date()
  }, {
    silent: true
  })

  return true
}

exports.removeTokenAsync = async (nodeTokenId) => {
  let nodeToken = await NodeToken.findById(nodeTokenId)
  if (!nodeToken) {
    return false
  }
  return nodeToken.destroy()
}
