const config = require('config')

const errors = require('../lib/errors')
const securityHandlers = {
  admin: require('./security/admin'),
  oauth: require('./security/oauth')
}

const extra = {
  appid: config.get('wechat.corpId'),
  response_type: 'code',
  scope: 'snsapi_base',
  redirect_uri: config.get('server.baseUrl') + 'api/wechat/oauth'
}

// 检查权限校验
let accessCheck = async function (ctx) {
  let securities = ctx.operation.getSecurity()
  if (!securities || !securities.length) {
    return true
  }

  for (let security of securities) {
    security = Object.keys(security)[0]
    if (!securityHandlers[security]) {
      throw new errors.SystemError(`security ${security} not found`)
    }

    let canAccess = await securityHandlers[security](ctx)
    if (canAccess) {
      return true
    }
  }
  return false
}

module.exports = async function (ctx, next) {
  let canAccess = await accessCheck(ctx)
  if (!canAccess) {
    throw new errors.Unauthorized('授权后访问', 'Unauthorized', extra)
  }

  await next()
}
