const config = require('config')

const userService = require('../../service/user')

module.exports = async (ctx) => {
  // 设置登陆用户、测试用
  if (config.get('env') === 'test') {
    let userId = ctx.get('x-user-id')
    if (userId) {
      let user = await userService.getAsync(userId)
      ctx.session.user = user || { userId }
    }
  }

  let user = ctx.session.user
  return Boolean(user && user.userId)
}
