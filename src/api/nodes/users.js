const _ = require('lodash')
const userService = require('../../service/user')

const filter = ['userId', 'port', 'password', 'isLocked']

module.exports = async (ctx) => {
  let users = await userService.findAsync()
  ctx.body = users.map((user) => {
    user = user.get({plain: true})
    if (user.flowUp + user.flowDown >= user.trafficLimit) {
      user.isLocked = true
    }
    return _.pick(user, filter)
  })
}
