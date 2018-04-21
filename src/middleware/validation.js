const _ = require('lodash')

const errors = require('../lib/errors')

// 获取request
let getRequest = (ctx) => {
  let filter = ['body', 'headers', 'query', 'url']
  let request = _.pick(ctx.request, filter)
  if (ctx.is('multipart')) {
    request.files = request.body.files
    request.body = request.body.fields
  }
  return request
}

// 获取错误原因
let getValidationError = (error, preField = '') => {
  let field = error.name
  if (!field) {
    field = (error.path && error.path.join('.')) || preField
  }

  if (error.errors && error.errors.length) {
    return getValidationError(error.errors[0], field)
  }

  let reason = error.message
  return {field, reason}
}

module.exports = async (ctx, next) => {
  if (ctx.operation) {
    let request = getRequest(ctx)
    let validationReq = ctx.operation.validateRequest(request)
    if (validationReq.errors.length) {
      let error = getValidationError(validationReq)
      let message = `parameter '${error.field}' error: '${error.reason}'`
      throw new errors.BadRequest(message)
    }
  }

  await next()
}
