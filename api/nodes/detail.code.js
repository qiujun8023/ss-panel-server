'use strict'

const {Node} = require('../../service')
const errors = require('../../lib/errors')
const format = require('../../lib/format')

module.exports = {
  *get (req, res) {
    let {nodeId} = req.query
    let node = yield Node.getAsync(nodeId)
    if (!node) {
      throw new errors.NotFound('未找到相关节点')
    }

    res.json(format.node(node))
  }
}
