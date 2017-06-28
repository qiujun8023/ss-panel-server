'use strict'

const {User} = require('../service')
const format = require('../lib/format')
const errors = require('../lib/errors')

module.exports = {
  *get (req, res) {
    let users = yield User.findAsync({}, 'activeAt desc')
    for (let i = 0; i < users.length; i++) {
      users[i] = format.user(users[i])
    }
    res.json(users)
  },

  *put (req, res) {
    let user
    try {
      user = yield User.updateAsync(req.body.userId, req.body)
    } catch (err) {
      throw new errors.BadRequest('修改失败，可能端口已存在')
    }

    if (!user) {
      throw new errors.NotFound('未找到相关用户')
    }

    res.json(format.user(user))
  }
}
