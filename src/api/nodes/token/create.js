const errors = require('../../../lib/errors')
const nodeService = require('../../../service/node')
const tokenService = require('../../../service/node_token')

module.exports = async (ctx) => {
  let { nodeId } = ctx.params
  let { title } = ctx.request.body

  let node = await nodeService.getAsync(nodeId)
  if (!node) {
    throw new errors.NotFound('未找到相关节点')
  }

  ctx.body = await tokenService.createAsync({ nodeId, title })
  ctx.status = 201
}
