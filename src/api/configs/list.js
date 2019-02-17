const configService = require('../../service/config')

module.exports = async (ctx) => {
  let configs = await configService.findAsync()
  ctx.body = configs.filter((config) => config.isEditable)
}
