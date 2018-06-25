const userService = require('../../service/user')

module.exports = async (ctx) => {
  let { userId } = ctx.params

  await userService.removeAsync(userId)
  ctx.body = { result: true }
}
