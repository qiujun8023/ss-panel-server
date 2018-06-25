const redis = require('../lib/redis')
const { Config } = require('../model')
const configData = require('../model/data/config')

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

// 刷新缓存
exports.refreshAsync = async () => {
  await exports.findAsync(false)
  return true
}

// 获取配置
exports.getAsync = async (configId) => {
  return Config.findById(configId)
}

// 获取单个配置
exports.getByKeyAsync = async (key, cache = true) => {
  let configs = await exports.findAsync(cache)
  for (let config of configs) {
    if (config.key === key && configData[key]) {
      return configData[key].format(config.value)
    }
  }
  return false
}

// 更新配置信息
exports.updateAsync = async (configId, data) => {
  let config = await Config.findById(configId)
  if (!config) {
    return false
  }

  return config.update(data)
}

// 获取端口范围
exports.getPortRangeAsync = async () => {
  return {
    minPort: await exports.getByKeyAsync('min-port'),
    maxPort: await exports.getByKeyAsync('max-port')
  }
}
