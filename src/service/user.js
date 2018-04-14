const _ = require('lodash')
const config = require('config')
const Sequelize = require('sequelize')

const errors = require('../lib/errors')
const sequelize = require('../lib/sequelize')
const utils = require('../lib/utils')
const { User } = require('../model')

let { minPort, maxPort, initTrafficLimit } = config.get('ss')

// 创建用户
exports.createAsync = async (data) => {
  let isolationLevel = Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  let transaction = await sequelize.transaction({ isolationLevel })
  try {
    // 获取已使用的端口列表
    let users = User.findAll({
      attributes: ['port'],
      transaction
    })
    let ports = _.map(users, 'port')

    // 选取空闲端口
    let port = utils.randUniquePort(ports, minPort, maxPort)
    if (!port) {
      throw new errors.SystemError('未找到空闲端口')
    }

    // 创建用户
    data = Object.assign({
      port,
      password: utils.randPassword(),
      trafficLimit: initTrafficLimit
    }, data || {})
    let user = await User.create(data, { transaction })

    // 提交事物
    await transaction.commit()

    return user
  } catch (err) {
    // 回滚事物
    await transaction.rollback()
    throw err
  }
}

// 获取用户信息
exports.getAsync = async (userId) => {
  return User.findById(userId)
}

exports.getByUserNameAsync = async (username) => {
  return User.findOne({
    where: { username }
  })
}

// 获取用户列表
exports.findAsync = async (where) => {
  return User.findAll({
    where,
    order: [['activedAt', 'desc']]
  })
}

// 更新用户信息
exports.updateAsync = async (userId, data) => {
  let user = await User.findById(userId)
  if (!user) {
    return false
  }

  return user.update(data)
}

// 删除用户
exports.removeAsync = async (userId) => {
  let user = await User.findById(userId)
  if (!user) {
    return false
  }

  return user.destroy()
}
