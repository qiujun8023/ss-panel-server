'use strict'

const co = require('co')

const {User} = require('../../service')
const errors = require('../../lib/errors')
const wechat = require('./wechat')

module.exports = function () {
  return function* (req, res, next) {
    yield wechat()(req, res, function (err) {
      if (err) {
        next(err)
        return
      }

      co(function* () {
        let {userId} = req.session.user
        let user = yield User.getAsync(userId)
        if (!user.isAdmin) {
          throw new errors.Forbidden('无权访问')
        }
      }).then(next).catch(next)
    })
  }
}
