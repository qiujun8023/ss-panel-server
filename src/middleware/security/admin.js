const errors = require('../../lib/errors')
const oauthSecurity = require('./oauth')
const userService = require('../../service/user')

module.exports = async (ctx) => {
  let canAccess = await oauthSecurity(ctx)
  if (!canAccess) {
    return false
  }

  let { userId } = ctx.session.user
  let user = await userService.getAsync(userId)
  if (!user.isAdmin) {
    throw new errors.Forbidden('无权访问')
  }
}
