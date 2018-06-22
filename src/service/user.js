const _ = require('lodash')

const { User } = require('../model')
const utils = require('../lib/utils')
const errors = require('../lib/errors')
const configService = require('./config')

// 选取空闲端口
exports.randUniquePortAsync = async () => {
  // 获取已使用的端口列表
  let users = await User.findAll({
    attributes: ['port']
  })
  let ports = _.map(users, 'port')

  // 获取端口范围
  let { minPort, maxPort } = await configService.getPortRangeAsync()

  // 选取空闲端口
  return utils.randUniquePort(ports, minPort, maxPort)
}

// 创建用户
exports.createAsync = async (data) => {
  // 选取空闲端口
  let port = await exports.randUniquePortAsync()
  if (!port) {
    throw new errors.SystemError('未找到空闲端口')
  }

  // 获取默认流量限制
  let trafficLimitMb = await configService.getByKeyAsync('default-traffic-Limit', 10240, Number)

  // 创建用户
  return User.create(Object.assign({
    port,
    password: utils.randomString(),
    trafficLimit: trafficLimitMb * 1024 * 1024
  }, data || {}))
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

// 是否第一个用户
exports.isFirstUserAsync = async () => {
  let users = await exports.findAsync()
  return users.length === 0
}

// 更新用户信息
exports.updateAsync = async (userId, data) => {
  let user = await User.findById(userId)
  if (!user) {
    return false
  }

  return user.update(data)
}

// 更新用户流量数据
exports.updateTrafficAsync = async (userId, flowUp, flowDown) => {
  let user = await User.findById(userId)
  if (!user) {
    return false
  }

  // 更新用户流量数据
  await user.increment({ flowUp, flowDown }, {
    silent: true
  })

  // 更新活跃时间
  return user.update({
    activedAt: new Date()
  }, {
    silent: true
  })
}

// 初始化用户流量
exports.initTrafficAsync = async (where) => {
  return User.update({
    flowUp: 0,
    flowDown: 0
  }, {
    where: where || {},
    silent: true
  })
}

// 删除用户
exports.removeAsync = async (userId) => {
  let user = await User.findById(userId)
  if (!user) {
    return false
  }

  return user.destroy()
}
