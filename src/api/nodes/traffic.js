const userService = require('../../service/user')
const nodeService = require('../../service/node')
const trafficService = require('../../service/traffic')

const MIN_FLOW = 1024

module.exports = async (ctx) => {
  let { nodeId } = ctx.params
  let { body } = ctx.request

  await nodeService.updateActivedAtAsync(nodeId)
  for (let item of body) {
    if (item.flowUp < MIN_FLOW && item.flowDown < MIN_FLOW) {
      continue
    }
    await userService.updateTrafficAsync(item.userId, item.flowUp, item.flowDown)
    await trafficService.createAsync(Object.assign({ nodeId }, item))
  }
  ctx.body = { success: true }
}
