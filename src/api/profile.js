const _ = require('lodash')
const config = require('config')

const {User} = require('../service')
const errors = require('../lib/errors')
const format = require('../lib/format')

module.exports = {
  *get (req, res) {
    let {userId} = req.session.user
    let user = yield User.getAsync(userId)

    res.json(format.user(user))
  },

  *put (req, res) {
    let {userId} = req.session.user
    let data = _.pick(req.body, ['port', 'password'])

    let {minPort, maxPort} = config.ss
    if (data.port && (data.port < minPort || data.port > maxPort)) {
      throw new errors.BadRequest(`端口号需在 ${minPort} - ${maxPort} 范围内`)
    }

    let user
    try {
      user = yield User.updateAsync(userId, data)
    } catch (err) {
      throw new errors.BadRequest('修改失败，可能端口已存在')
    }

    res.json(format.user(user))
  }
}
