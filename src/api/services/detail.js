const errors = require('../../lib/errors')
const serviceService = require('../../service/service')

module.exports = async (ctx) => {
  let { userId } = ctx.session.user
  let { serviceId } = ctx.params

  let service = await serviceService.getAsync(userId, serviceId)
  if (!service) {
    throw new errors.NotFound('未找到相关服务')
  }

  ctx.body = service
}
