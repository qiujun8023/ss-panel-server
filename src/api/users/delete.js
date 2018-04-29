const errors = require('../../lib/errors')
const userService = require('../../service/user')

module.exports = async (ctx) => {
  let { userId } = ctx.params
  let user = await userService.getAsync(userId)
  if (!user) {
    throw new errors.NotFound('未找到相关用户')
  }

  await userService.removeAsync(userId)
  ctx.body = { result: true }
}
