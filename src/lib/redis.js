const config = require('config')
const Redis = require('ioredis')

let redisConfig = config.get('redis')
module.exports = new Redis(redisConfig)
