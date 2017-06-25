'use strict'

const _ = require('lodash')
const config = require('config')

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
    let {minPort, maxPort} = config.ss
    let data = _.pick(req.body, ['port', 'password', 'transferEnable', 'isAdmin', 'isLocked'])
    if (data.port && (data.port < minPort || data.port > maxPort)) {
      throw new errors.BadRequest(`端口号需在 ${minPort} - ${maxPort} 范围内`)
    } else if (data.transferEnable <= 0) {
      throw new errors.BadRequest('流量限额无效')
    }

    let user = yield User.updateAsync(req.body.userId, data)
    if (!user) {
      throw new errors.NotFound('未找到相关用户')
    }

    res.json(format.user(user))
  }
}
