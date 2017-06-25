'use strict'

const config = require('config')

const {User} = require('../../service')
const errors = require('../../lib/errors')

const extra = {
  appid: config.wechat.corpid,
  response_type: 'code',
  scope: 'snsapi_base',
  redirect_uri: config.baseUrl + 'api/wechat/oauth'
}

module.exports = function () {
  return function* (req, res, next) {
    // 设置登陆用户、测试用
    if (config.env === 'test') {
      let user
      let userId = req.get('x-user-id')
      if (userId) {
        user = yield User.getAsync(userId)
      }

      // 如设置 userId 则设置 session
      if (user) {
        req.session = req.session || {}
        req.session['user'] = user
        return next()
      } else if (userId && !user) {
        throw new errors.NotFound('用户不存在')
      }
    }

    // 判断用户信息是否有效
    let session = req.session
    if (!session || !session.user) {
      throw new errors.Unauthorized('登录后访问', 'Unauthorized', extra)
    }

    next()
  }
}
