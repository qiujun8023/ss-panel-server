const _ = require('lodash')

const nodeService = require('../../service/node')

module.exports = async (ctx) => {
  let filter = ['name', 'avatar', 'server', 'description', 'method', 'isVisible', 'sort']
  let data = _.pick(ctx.request.body, filter)

  ctx.body = await nodeService.addAsync(data)
  ctx.status = 201
}
