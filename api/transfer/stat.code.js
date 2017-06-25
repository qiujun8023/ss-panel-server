'use strict'

const _ = require('lodash')

const {User, Transfer} = require('../../service')
const format = require('../../lib/format')

module.exports = {
  *get (req, res) {
    let {userId} = req.session.user

    let where
    let user = yield User.getAsync(userId)
    if (user.isAdmin) {
      where = _.pick(req.query, ['nodeId', 'userId'])
    }
    if (!where.nodeId && !where.userId) {
      where = {userId}
    }

    let result = []
    let data = yield Transfer.findStatAsync(where)
    for (let item of data) {
      result.push(format.transferStat(item))
    }

    res.json(result)
  }
}
