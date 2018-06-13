const path = require('path')

const pkg = require('../package')

module.exports = {
  env: 'development',
  debug: true,

  server: {
    host: '127.0.0.1',
    port: 8000,
    clientPath: path.join(__dirname, '../../client/dist'),
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
    host: 'localhost',
    user: 'shadowsocks',
    password: 'password',
    database: 'shadowsocks',
    timezone: 'Asia/Shanghai'
  },

  wechat: {
    corpId: 'wx4e2c2b771c467c9f',
    secret: 'k7TGD8xJLDU6-sPH3NwY0eTs2oBPyAINMdbSbGN80fuEt01UK0Z8dWzhm7crgkz7',
    agentId: 0
  }
}
