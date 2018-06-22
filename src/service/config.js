const redis = require('../lib/redis')
const { Config } = require('../model')

const CACHE_KEY = 'configs'
const CACHE_TIME = 600

// 获取所有配置
exports.findAsync = async (cache = true) => {
  if (cache) {
    let configs = await redis.get(CACHE_KEY)
    if (configs) {
      return JSON.parse(configs)
    }
  }

  let configs = await Config.findAll()
  await redis.setex(CACHE_KEY, CACHE_TIME, JSON.stringify(configs))
  return configs
}

// 获取单个配置
exports.getByKeyAsync = async (key, value = '', format = String, cache = true) => {
  let configs = await exports.findAsync(cache)
  for (let config of configs) {
    if (config.key === key) {
      return format(config.value)
    }
  }
  return format(value)
}

// 更新配置信息
exports.updateByKeyAsync = async (key, value) => {
  let config = await Config.findOne({
    where: { key }
  })
  if (!config) {
    return false
  }

  return config.update({ value })
}

// 获取端口范围
exports.getPortRangeAsync = async () => {
  let minPort = await exports.getByKeyAsync('min-port', 50000, Number)
  let maxPort = await exports.getByKeyAsync('max-port', 50999, Number)
  return { minPort, maxPort }
}
