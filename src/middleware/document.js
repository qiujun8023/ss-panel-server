const Router = require('koa-router')
const config = require('config')
const koaSwagger = require('koa2-swagger-ui')

const swagger = require('../swagger')

const SPEC_URL = '/api'
const DOCS_URL = '/doc'

let router = new Router()

// API 描述
router.get(SPEC_URL, async (ctx) => {
  ctx.body = swagger
})

// 页面文档
router.get(DOCS_URL, koaSwagger({
  routePrefix: false,
  swaggerOptions: {
    url: SPEC_URL
  }
}))

module.exports = router.routes()
