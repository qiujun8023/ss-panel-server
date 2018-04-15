const _ = require('lodash')

const errors = require('../../lib/errors')
const userService = require('../../service/user')

module.exports = async (ctx) => {
  let filter = ['username', 'nickname']
  let data = _.pick(ctx.request.body, filter)

  // 检查用户名
  let user = await userService.getByUserNameAsync(data.username)
  if (user) {
    throw new errors.BadRequest('用户名已存在')
  }

  ctx.body = await userService.createAsync(data)
  ctx.status = 201
}
