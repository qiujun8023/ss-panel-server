const nodeService = require('../../service/node')

module.exports = async (ctx) => {
  ctx.body = await nodeService.findAsync()
}
