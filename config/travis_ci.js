'use strict'

module.exports = {
  env: 'test',

  redis: {
    host: 'localhost',
    port: 6379,
    keyPrefix: 'ss-panle:'
  },

  mysql: {
    poolSize: 5,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shadowsocks',
    timezone: '+08:00'
  }
}
