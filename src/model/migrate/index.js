const sequelize = require('../../lib/sequelize')

// const migrateConfig = {
//   '4.0.2': [
//     '20180611/alter-node-token.sql'
//   ]
// }

// const migrate = async

module.exports = async () => {
  // 同步数据到数据库
  await sequelize.sync()
}
