const config = require('config')

const app = require('./app')
const logger = require('./lib/logger')

// 启动 Web 服务
let serverConfig = config.get('server')
app.listen(serverConfig.port, serverConfig.host, () => {
  logger.info('listen server at %s', serverConfig.baseUrl)
})
