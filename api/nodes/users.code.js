'use strict'

const {Node} = require('../../service')
const format = require('../../lib/format')

module.exports = {
  *get (req, res) {
    let result = []
    let nodeId = req.query.nodeId
    let users = yield Node.findUserAsync(nodeId)
    for (let item of users) {
      result.push(format.nodeUser(item))
    }

    res.json(result)
  }
}
