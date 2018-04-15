const Koa = require('koa')
const koaBody = require('koa-bodyparser')
const config = require('config')

const errorHandle = require('./middleware/error_handle')
const document = require('./middleware/document')
const session = require('./middleware/session')
const swagger = require('./middleware/swagger')
const security = require('./middleware/security')
const validation = require('./middleware/validation')
const router = require('./middleware/router')

const app = new Koa()

app.keys = config.get('keys')

app.use(koaBody())
app.use(session)

if (config.get('debug')) {
  app.use(document)
}

app.use(errorHandle)

app.use(swagger)
app.use(security)
app.use(validation)

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app
