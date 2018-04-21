const sway = require('sway')

const definition = require('../swagger')

// 单例模式
let getSwaggerAsync = (() => {
  let swagger = null
  return async () => {
    if (!swagger) {
      swagger = await sway.create({definition})
    }
    return swagger
  }
})()

module.exports = async (ctx, next) => {
  let swagger = await getSwaggerAsync()
  ctx.operation = swagger.getOperation(ctx.request)
  await next()
}
