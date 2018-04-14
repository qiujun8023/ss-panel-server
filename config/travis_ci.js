module.exports = {
  env: 'test',
  debug: false,

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
    database: 'shadowsocks'
  }
}
