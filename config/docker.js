module.exports = {
  env: 'production',
  debug: process.env.APP_DEBUG === 'false',

  server: {
    host: '0.0.0.0',
    port: 8000,
    baseUrl: process.env.APP_SERVER_BASE_URL || 'http://localhost:8000/'
  },

  keys: [
    process.env.APP_KEYS_1 || 'im a newer secret',
    process.env.APP_KEYS_2 || 'i like turtle'
  ],

  redis: {
    host: process.env.APP_REDIS_HOST || 'redis',
    port: Number(process.env.APP_REDIS_PORT || 6379),
    keyPrefix: process.env.APP_REDIS_KEY_PREFIX || 'ss-panle:'
  },

  mysql: {
    host: process.env.APP_MYSQL_HOST || 'mysql',
    port: Number(process.env.APP_MYSQL_PORT || 3306),
    user: process.env.APP_MYSQL_USER || 'root',
    password: process.env.APP_MYSQL_PASSWORD || 'root',
    database: process.env.APP_MYSQL_DATABASE || 'shadowsocks',
    timezone: process.env.APP_MYSQL_TIMEZONE || 'Asia/Shanghai'
  },

  wechat: {
    corpId: process.env.APP_WECHAT_CORP_ID || 'corp id',
    secret: process.env.APP_WECHAT_SECRET || 'secret',
    agentId: Number(process.env.APP_WECHAT_AGENT_ID || 0)
  }
}
