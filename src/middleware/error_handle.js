const logger = require('../lib/logger')
const errors = require('../lib/errors')

module.exports = async (ctx, next) => {
  try {
    await next()

    // API 不存在抛出页面不存在异常
    let {status, body} = ctx
    if (!status || (status === 404 && body == null)) {
      throw new errors.NotFound('页面未找到')
    }
  } catch (err) {
    let res = err
    if (!(err instanceof errors.HttpError)) {
      let message = err
      if (typeof err !== 'string') {
        message = err.message
      }
      res = new errors.SystemError(message)
    }

    if (res instanceof errors.SystemError) {
      logger.error(err)
    }

    ctx.status = res.status || 500
    ctx.body = res
  }
}
