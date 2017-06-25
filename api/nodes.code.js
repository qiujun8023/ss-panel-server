'use strict'

const _ = require('lodash')

const {Node} = require('../service')
const errors = require('../lib/errors')
const format = require('../lib/format')

module.exports = {
  *get (req, res) {
    let result = []
    let nodes = yield Node.findAsync()
    for (let node of nodes) {
      result.push(format.node(node))
    }
    res.json(result)
  },

  *put (req, res) {
    let {nodeId} = req.body
    let filter = ['name', 'avatar', 'server', 'description', 'method', 'isVisible', 'sort']
    let data = _.pick(req.body, filter)

    // 获取节点信息
    let node = yield Node.getAsync(nodeId)
    if (!node) {
      throw new errors.NotFound('未找到相关设置')
    }

    // 更新节点
    node = yield Node.updateAsync(nodeId, data)
    res.json(format.node(node))
  },

  *post (req, res) {
    let filter = ['name', 'avatar', 'server', 'description', 'method', 'isVisible', 'sort']
    let data = _.pick(req.body, filter)
    let node = yield Node.addAsync(data)
    res.status(201).json(format.node(node))
  },

  *delete (req, res) {
    // 获取节点信息
    let {nodeId} = req.query
    let node = yield Node.getAsync(nodeId)
    if (!node) {
      throw new errors.NotFound('未找到相关节点')
    }

    // 删除设置
    yield Node.removeAsync(nodeId)
    res.json({result: true})
  }
}
