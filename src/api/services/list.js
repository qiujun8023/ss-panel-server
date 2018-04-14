const errors = require('../../lib/errors')
const serviceService = require('../../service/service')

module.exports = async (ctx) => {
  let { userId } = ctx.session.user
  let services = await serviceService.findAsync(userId)
  if (!services) {
    throw new errors.BadRequest('用户不存在')
  }
  ctx.body = services
}
