const _ = require('lodash')
const config = require('config')

const errors = require('../../lib/errors')
const userService = require('../../service/user')

module.exports = async (ctx, scope) => {
  // 设置登陆用户、测试用
  if (config.get('env') === 'test') {
    let userId = ctx.get('x-user-id')
    if (userId) {
      let user = await userService.getAsync(userId)
      ctx.session.user = user || { userId }
    }
  }

  // 未设置Session
  let userId = _.get(ctx.session, 'user.userId')
  if (!userId) {
    return false
  }

  // 用户不存在
  let user = await userService.getAsync(userId)
  if (!user) {
    delete ctx.session.user
    return false
  }

  // 需要管理员权限
  if (scope && scope.indexOf('admin') !== -1) {
    if (!user.isAdmin) {
      throw new errors.Forbidden('无权访问')
    }
  }

  return true
}
