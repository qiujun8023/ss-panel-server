const nodeService = require('../../service/node')

module.exports = async (ctx) => {
  let { nodeId } = ctx.params

  await nodeService.removeAsync(nodeId)
  ctx.body = { result: true }
}
