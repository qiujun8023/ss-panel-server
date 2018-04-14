const userService = require('../../service/user')

module.exports = async (ctx) => {
  let { userId } = ctx.session.user
  ctx.body = await userService.getAsync(userId)
}
