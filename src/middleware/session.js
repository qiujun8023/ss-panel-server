const session = require('koa-generic-session')
const RedisStore = require('koa-redis')

const redis = require('../lib/redis')

let options = {
  store: new RedisStore({
    client: redis
  }),
  key: 'SESSIONID',
  prefix: 'session:',
  maxAge: 30 * 1000 * 60
}

module.exports = session(options)
