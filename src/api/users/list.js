const userService = require('../../service/user')

module.exports = async (ctx) => {
  ctx.body = await userService.findAsync()
}
