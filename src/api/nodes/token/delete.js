const tokenService = require('../../service/node')

module.exports = async (ctx) => {
  let { tokenId } = ctx.params

  await tokenService.removeAsync(tokenId)
  ctx.body = { result: true }
}
