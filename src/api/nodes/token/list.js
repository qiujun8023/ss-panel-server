const errors = require('../../../lib/errors')
const nodeService = require('../../../service/node')
const tokenService = require('../../../service/node_token')

module.exports = async (ctx) => {
  let { nodeId } = ctx.params
  let node = await nodeService.getAsync(nodeId)
  if (!node) {
    throw new errors.NotFound('未找到相关节点')
  }
  ctx.body = await tokenService.findAsync({ nodeId })
}
