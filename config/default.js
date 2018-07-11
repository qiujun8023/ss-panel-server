const path = require('path')

const pkg = require('../package')

module.exports = {
  env: 'development',
  debug: true,

  server: {
    host: '127.0.0.1',
    port: 8000, // 服务端口
    clientPath: path.join(__dirname, '../../client/dist'),
    baseUrl: 'http://localhost:8000/' // 对外地址信息
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
    host: 'localhost', // Redis 地址
    port: 6379, // Redis 端口
    keyPrefix: 'ss-panle:' // Redis 前缀，一般不用修改
  },

  mysql: {
    host: 'localhost', // 数据库地址
    user: 'shadowsocks', // 数据库用户名
    password: 'password', // 数据库密码
    database: 'shadowsocks', // 数据库库名
    timezone: 'Asia/Shanghai' // 时区
  },

  wechat: {
    corpId: 'wx4e2c2b771c467c9f', // 微信企业号/企业微信 的 corpId
    secret: 'k7TGD8xJLDU6-sPH3NwY0eTs2oBPyAINMdbSbGN80fuEt01UK0Z8dWzhm7crgkz7',
    agentId: 0 // 应用 ID
  }
}
