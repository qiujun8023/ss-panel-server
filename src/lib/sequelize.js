const config = require('config')
const Sequelize = require('sequelize')

const logger = require('./logger')

let mysqlConfig = config.get('mysql')

module.exports = new Sequelize(mysqlConfig.database, mysqlConfig.user, mysqlConfig.password, {
  host: mysqlConfig.host,
  port: mysqlConfig.port,
  dialect: 'mysql',

  dialectOptions: {
    multipleStatements: true
  },

  operatorsAliases: false,
  logging: (sql) => logger.debug(sql),
  timezone: config.get('server.timezone')
})
