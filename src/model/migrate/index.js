const utils = require('../../lib/utils')
const logger = require('../../lib/logger')
const sequelize = require('../../lib/sequelize')
const { Config } = require('../definition')

const migrateConfig = {
  '0.4.3': [
    '20180611/alter-node-token.sql'
  ]
}

// 获取设置信息
const getConfigAsync = async (key) => {
  return Config.findOne({
    where: { key }
  })
}

// 获取数据库版本信息
const getDbVersionAsync = async () => {
  let config = await getConfigAsync('version')
  return config && config.get('value')
}

// 更新数据库版本信息
const updateDbVersionAsync = async (value) => {
  let config = await getConfigAsync('version')
  if (!config) {
    return false
  }
  return config.update({ value })
}

// 数据库升级一个版本
const upgradAsync = async (v1, v2, sqls) => {
  logger.info(`upgrade from version ${v1} to version ${v2}`)
}

const migrateAsync = async (pgVersion, dbVersion) => {
  let versions = Object.keys(migrateConfig).sort(utils.versionCompare)
  for (let version of versions) {
    if (utils.versionCompare(version, dbVersion) <= 0) {
      continue
    } else if (utils.versionCompare(version, pgVersion) > 0) {
      continue
    }

    // 数据库升级
    await upgradAsync(dbVersion, version, migrateConfig[version])
    await updateDbVersionAsync(version)
    dbVersion = version
  }
}

module.exports = async (pgVersion) => {
  // 同步数据库结构
  await sequelize.sync()

  // 数据库升级
  let dbVersion = await getDbVersionAsync()
  if (dbVersion) {
    await migrateAsync(pgVersion, dbVersion)
    await updateDbVersionAsync(pgVersion)
  }
}
