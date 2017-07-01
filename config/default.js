'use strict'

const path = require('path')

const pkg = require('../package')

module.exports = {
  host: 'localhost',
  port: '8003',
  baseUrl: 'http://localhost:8003/',

  env: 'development',

  swagger: {
    info: {
      version: pkg.version
    }
  },

  session: {
    secret: 'ss-panle secret',
    name: 'SESSION'
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
    database: 'shadowsocks',
    timezone: '+08:00'
  },

  wechat: {
    corpid: 'wx4e2c2b771c467c9f',
    secret: 'k7TGD8xJLDU6-sPH3NwY0eTs2oBPyAINMdbSbGN80fuEt01UK0Z8dWzhm7crgkz7',
    agentid: 0
  },

  ss: {
    minPort: 50001,
    maxPort: 50999,
    maxDowntime: 120000, // 监控报警阈值， 单位 毫秒
    initTransferEnable: 10737418240, // 10G 流量
    randomPasswordPool: '0123456789abcdefghijklmnopqrstuvwxyz', // 随机密码字符集
    transferLogSaveDays: 180 // 单位 天
  },

  clientDir: path.join(__dirname, '../../client/dist')
}
