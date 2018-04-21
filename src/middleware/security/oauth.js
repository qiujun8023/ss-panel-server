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

  let { user } = ctx.session
  if (user && user.userId) {
    // 管理员权限判断
    if (scope && scope.indexOf('admin') !== -1) {
      let tmpUser = await userService.getAsync(user.userId)
      if (!tmpUser.isAdmin) {
        throw new errors.Forbidden('无权访问')
      }
    }
    return true
  }
  return false
}
