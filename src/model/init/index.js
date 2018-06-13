const Sequelize = require('sequelize')

const { Config } = require('../definition')
const sequelize = require('../../lib/sequelize')
const initConfigs = require('./data/config.json')

// 初始化配置信息
let initConfig = async (version) => {
  // 创建事物
  let transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  })

  // 获取已存在的配置信息
  let configs = await Config.findAll({transaction})
  let existKeys = configs.map(c => c.get('key'))

  // 筛选未插入的数据
  let insertConfigs = []
  for (let config of initConfigs) {
    if (existKeys.indexOf(config.key) !== -1) {
      continue
    } else if (config.key === 'version') {
      config.value = version
    }
    insertConfigs.push(config)
  }

  // 插入数据
  if (insertConfigs.length > 0) {
    await Config.bulkCreate(insertConfigs)
  }

  // 提交事物
  await transaction.commit()
}

module.exports = async (version) => {
  await initConfig(version)
}
