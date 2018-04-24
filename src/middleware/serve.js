const config = require('config')
const serve = require('koa-static')

let clientPath = config.get('server.clientPath')
module.exports = serve(clientPath)
