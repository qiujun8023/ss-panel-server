const _ = require('lodash')

const errors = require('../../lib/errors')
const userService = require('../../service/user')

module.exports = async (ctx) => {
  let { userId } = ctx.params

  let filter = [
    'username',
    'nickname',
    'port',
    'password',
    'trafficLimit',
    'isAdmin',
    'isLocked'
  ]
  let data = _.pick(ctx.request.body, filter)

  let { minPort, maxPort } = await userService.getPortRangeAsync()
  if (data.port && (data.port < minPort || data.port > maxPort)) {
    throw new errors.BadRequest(`端口号需在 ${minPort} - ${maxPort} 范围内`)
  }

  let user
  try {
    user = await userService.updateAsync(userId, data)
  } catch (err) {
    throw new errors.BadRequest('修改失败，端口或用户名已存在')
  }

  if (!user) {
    throw new errors.NotFound('未找到相关用户')
  }

  ctx.body = user
}
