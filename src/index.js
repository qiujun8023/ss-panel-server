const config = require('config')

const app = require('./app')
const cron = require('./cron')
const logger = require('./lib/logger')

// 启动 Web 服务
let serverConfig = config.get('server')
app.listen(serverConfig.port, serverConfig.host, () => {
  logger.info('Listen server at %s', serverConfig.baseUrl)

  // 启动计划任务
  cron.startAllJob()
})
