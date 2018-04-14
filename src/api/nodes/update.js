const _ = require('lodash')

const errors = require('../../lib/errors')
const nodeService = require('../../service/node')

module.exports = async (ctx) => {
  let { nodeId } = ctx.params
  let filter = ['name', 'avatar', 'server', 'method', 'description', 'isVisible', 'sort']
  let data = _.pick(ctx.request.body, filter)

  // 获取节点信息
  let node = await nodeService.getAsync(nodeId)
  if (!node) {
    throw new errors.NotFound('未找到相关节点')
  }

  ctx.body = await nodeService.updateAsync(nodeId, data)
}
