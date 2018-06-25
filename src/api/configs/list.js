const configService = require('../../service/config')

module.exports = async (ctx) => {
  ctx.body = await configService.findAsync()
}
