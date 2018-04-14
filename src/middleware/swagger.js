const sway = require('sway')

const definition = require('../swagger')

// 单例模式
let getSwaggerAsync = (function () {
  let swagger = null
  return async function () {
    if (!swagger) {
      swagger = await sway.create({definition})
    }
    return swagger
  }
})()

module.exports = async function (ctx, next) {
  let swagger = await getSwaggerAsync()
  ctx.operation = swagger.getOperation(ctx.request)
  await next()
}
