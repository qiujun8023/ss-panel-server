'use strict'

const errors = require('../../lib/errors')
const wechat = require('../../lib/wechat')
const {User} = require('../../service')

module.exports = {
  *get (req, res) {
    let {code, state} = req.query

    // 获取用户 ID
    let userId
    try {
      userId = (yield wechat.getUserIdByCodeAsync(code)).UserId
    } catch (err) {
      throw new errors.BadRequest(err.message)
    }

    // 获取姓名
    let name
    try {
      name = (yield wechat.getUserAsync(userId)).name
    } catch (err) {
      throw new errors.BadGateway(err.message || '请求微信服务器失败')
    }

    // 获取用户信息
    let user = yield User.getAsync(userId)
    if (!user) {
      user = yield User.createAsync({userId, name})
    } else {
      yield User.updateAsync(userId, {name})
    }

    req.session.user = user
    res.redirect(state || '/')
  }
}
