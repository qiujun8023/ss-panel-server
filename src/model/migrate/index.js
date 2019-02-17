const fs = require('fs')
const path = require('path')

const glob = require('glob')

const utils = require('../../lib/utils')
const logger = require('../../lib/logger')
const sequelize = require('../../lib/sequelize')
const { Config } = require('../definition')

let migrateConfig = {}
let sqls = glob.sync(`**/*.sql`, {cwd: __dirname})
for (let sql of sqls) {
  let [version] = sql.split('/', 2)
  migrateConfig[version] = migrateConfig[version] || []
  migrateConfig[version].push(sql)
}

// 获取数据库版本信息
const getDbVersionConfigAsync = async () => {
  return Config.findOne({
    attributes: ['configId', 'value'],
    where: {
      key: 'version'
    }
  })
}

// 更新数据库版本信息
const updateDbVersionConfigAsync = async (value) => {
  let config = await getDbVersionConfigAsync()
  if (!config) {
    return false
  }
  return config.update({ value })
}

// 数据库升级一个版本
const upgradAsync = async (v1, v2, sqlFiles) => {
  logger.info(`upgrade from version ${v1} to version ${v2}`)
  for (let sqlFile of sqlFiles) {
    let sqlPath = path.join(__dirname, sqlFile)
    let sql = fs.readFileSync(sqlPath, 'utf-8')
    await sequelize.query(sql)
  }
  return true
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
    await updateDbVersionConfigAsync(version)
    dbVersion = version
  }
}

module.exports = async (pgVersion) => {
  // 同步数据库结构
  await sequelize.sync()

  // 数据库升级
  let dbVersionConfig = await getDbVersionConfigAsync()
  if (dbVersionConfig) {
    await migrateAsync(pgVersion, dbVersionConfig.get('value'))
    await updateDbVersionConfigAsync(pgVersion)
  }
}
