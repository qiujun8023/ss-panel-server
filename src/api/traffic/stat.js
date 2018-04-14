const _ = require('lodash')

const userService = require('../../service/user')
const trafficService = require('../../service/traffic')

module.exports = async (ctx) => {
  let { userId } = ctx.session.user

  let where = {}
  let user = await userService.getAsync(userId)
  if (user.isAdmin) {
    where = _.pick(ctx.request.query, ['nodeId', 'userId'])
  }
  if (!where.nodeId && !where.userId) {
    where = { userId }
  }

  ctx.body = await trafficService.findStatAsync(where)
}
