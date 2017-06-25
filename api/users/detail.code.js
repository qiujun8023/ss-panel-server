'use strict'

const {User} = require('../../service')
const errors = require('../../lib/errors')
const format = require('../../lib/format')

module.exports = {
  *get (req, res) {
    let {userId} = req.query
    let user = yield User.getAsync(userId)
    if (!user) {
      throw new errors.NotFound('未找到相关用户')
    }

    res.json(format.user(user))
  }
}
