const serviceService = require('../../service/service')

module.exports = async (ctx) => {
  let { userId } = ctx.session.user
  ctx.body = await serviceService.findAsync(userId)
}
