'use strict'

const models = require('../model')
const sequelize = require('../lib/sequelize')
const redis = require('../lib/redis')
const User = require('./user')

const NodeModel = models.Node
const TransferModel = models.Transfer

// 添加节点
exports.addAsync = function* (data) {
  let node = yield NodeModel.create(data)
  return node.get({plain: true})
}

// 获取节点
exports.getAsync = function* (nodeId) {
  let node = yield NodeModel.findById(nodeId)
  if (!node) {
    return false
  }

  return node.get({plain: true})
}

// 获取节点列表
exports.findAsync = function* (where, order, limit) {
  order = order || 'sort'
  let nodes = yield NodeModel.findAll({where, order, limit})

  let res = []
  for (let node of nodes) {
    res.push(node.get({plain: true}))
  }

  return res
}

exports.getStatusKey = function (nodeId) {
  return `node:${nodeId}:status`
}

// 获取节点状态（监控用）
exports.getStatusAsync = function* (nodeId) {
  let key = this.getStatusKey(nodeId)
  let status = yield redis.get(key)
  return status ? JSON.parse(status) : null
}

// 设置节点状态（监控用）
exports.setStatusAsync = function* (nodeId, status) {
  let key = this.getStatusKey(nodeId)
  return yield redis.set(key, JSON.stringify(status))
}

// 更新节点
exports.updateAsync = function* (nodeId, data) {
  let node = yield NodeModel.findById(nodeId)
  if (!node) {
    return false
  }

  node = yield node.update(data)
  return node.get({plain: true})
}

// 删除节点
exports.removeAsync = function* (nodeId) {
  let node = yield NodeModel.findById(nodeId)
  if (!node) {
    return false
  }
  return yield node.destroy()
}

exports.findUserAsync = function* (nodeId) {
  let data = yield TransferModel.findAll({
    attributes: [
      'userId',
      [sequelize.fn('MAX', sequelize.col('transfer.activeAt')), 'activeAt']
    ],
    where: {
      nodeId,
      $or: {
        flowUp: {$gte: 1024},
        flowDown: {$gte: 1024}
      }
    },
    group: 'userId',
    order: 'activeAt DESC'
  })
  let users = yield User.findAsync()

  let res = []
  for (let item of data) {
    let name = '未知'
    for (let user of users) {
      if (item.userId === user.userId) {
        name = user.name
        break
      }
    }
    res.push({
      name,
      userId: item.userId,
      activeAt: item.activeAt
    })
  }

  return res
}
