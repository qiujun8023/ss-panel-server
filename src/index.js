const config = require('config')

const app = require('./app')
const cron = require('./cron')
const model = require('./model')
const logger = require('./lib/logger')
const { version } = require('../package.json')

;(async () => {
  // 迁移数据库
  await model.migrate(version)

  // 初始化数据库
  await model.init(version)

  // 启动 Web 服务
  let serverConfig = config.get('server')
  app.listen(serverConfig.port, serverConfig.host, () => {
    logger.info('Listen server at %s', serverConfig.baseUrl)

    // 启动计划任务
    cron.startAllJob()
  })
})().catch((err) => {
  logger.error(err)
  process.exit(1)
})
