const tokenService = require('../../../service/node_token')

module.exports = async (ctx) => {
  let { tokenId } = ctx.params

  await tokenService.removeAsync(tokenId)
  ctx.body = { result: true }
}
