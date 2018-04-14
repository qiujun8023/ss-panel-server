const userService = require('../../service/user')
const errors = require('../../lib/errors')

module.exports = async (ctx) => {
  let { userId } = ctx.params
  let user = await userService.getAsync(userId)
  if (!user) {
    throw new errors.NotFound('未找到相关用户')
  }

  ctx.body = user
}
