'use strict'

const path = require('path')

const pkg = require('../package')

let env = process.env.NODE_ENV || 'development'

let config = {
  host: '127.0.0.1',
  port: '8003',
  baseUrl: 'http://127.0.0.1:8003/',

  env,
  debug: env === 'development',

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
    host: '127.0.0.1',
    port: 6379,
    keyPrefix: 'ss-panle:'
  },

  mysql: {
    poolSize: 5,
    host: '127.0.0.1',
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
    maxDowntime: 60, // 监控报警阈值， 单位 秒
    initTransferEnable: 10737418240, // 10G 流量
    randomPasswordPool: '0123456789abcdefghijklmnopqrstuvwxyz', // 随机密码字符集
    transferLogSaveDays: 180 // 单位 天
  },

  logger: {
    file: {
      filename: '/tmp/ss-panle.log'
    }
  },

  clientDir: path.join(__dirname, '../../client/dist')
}

module.exports = config
