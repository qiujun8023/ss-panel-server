const path = require('path')

const pkg = require('../package')

module.exports = {
  env: 'development',
  debug: true,

  server: {
    host: 'localhost',
    port: 8000,
    clientDir: path.join(__dirname, '../../client/dist'),
    baseUrl: 'http://localhost:8000/'
  },

  keys: [
    'im a newer secret',
    'i like turtle'
  ],

  swagger: {
    info: {
      version: pkg.version
    }
  },

  redis: {
    host: 'localhost',
    port: 6379,
    keyPrefix: 'ss-panle:'
  },

  mysql: {
    poolSize: 5,
    host: 'localhost',
    user: 'shadowsocks',
    password: 'password',
    database: 'shadowsocks'
  },

  wechat: {
    corpId: 'wx4e2c2b771c467c9f',
    secret: 'k7TGD8xJLDU6-sPH3NwY0eTs2oBPyAINMdbSbGN80fuEt01UK0Z8dWzhm7crgkz7',
    agentId: 0
  },

  ss: {
    minPort: 50001,
    maxPort: 50999,
    maxDowntime: 120000, // 监控报警阈值， 单位 毫秒
    initTrafficLimit: 10737418240, // 10G 流量
    transferLogSaveDays: 180 // 单位 天
  }
}
