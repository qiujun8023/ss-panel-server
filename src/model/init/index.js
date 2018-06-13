const Sequelize = require('sequelize')

const { Config } = require('../definition')
const sequelize = require('../../lib/sequelize')
const initConfigs = require('./data/config.json')

module.exports = async (version) => {
  let transaction = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  })

  let configs = await Config.findAll({transaction})
  let existKeys = configs.map(c => c.get('key'))
  let filterdConfigs = initConfigs.filter(c => existKeys.indexOf(c.key) === -1)
  if (filterdConfigs.length > 0) {
    await Config.bulkCreate(filterdConfigs)
  }
  await transaction.commit()

  return true
}
