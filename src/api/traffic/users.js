const trafficService = require('../../service/traffic')

module.exports = async (ctx) => {
  let { nodeId } = ctx.request.query
  ctx.body = await trafficService.findActiveUserAsync(nodeId)
}
