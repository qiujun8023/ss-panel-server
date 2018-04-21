const trafficService = require('../../service/traffic')

module.exports = async (ctx) => {
  let { nodeId } = ctx.params
  ctx.body = await trafficService.findActiveUserAsync(nodeId)
}
