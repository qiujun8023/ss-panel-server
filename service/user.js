'use strict'

const config = require('config')
const Sequelize = require('sequelize')

const models = require('../model')
const errors = require('../lib/errors')
const sequelize = require('../lib/sequelize')
const Utils = require('./utils')

const UserModel = models.User

// 创建用户
exports.createAsync = function* (data) {
  let isolationLevel = Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  return sequelize.transaction({isolationLevel}, function (t) {
    return UserModel.findAll({
      attributes: ['port'],
      transaction: t
    })
    .then(function (users) {
      // 获取已使用端口列表
      let ports = []
      users.forEach(function (user) {
        ports.push(user.get('port'))
      })

      // 选取空闲端口
      let port = Utils.randUniquePort(ports)
      if (!port) {
        throw new errors.SystemError('未找到空闲端口')
      }

      return port
    })
    .then(function (port) {
      // 创建用户
      let password = Utils.randPassword()
      let transferEnable = config.ss.initTransferEnable
      Object.assign(data, {port, password, transferEnable})
      return UserModel.create(data, {transaction: t})
    })
    .then(function (user) {
      // 返回用户详情
      return user.get({plain: true})
    })
  })
}

// 获取用户信息
exports.getAsync = function* (userId) {
  let user = yield UserModel.findById(userId)
  if (!user) {
    return false
  }

  return user.get({plain: true})
}

// 获取用户列表
exports.findAsync = function* (where, order, limit) {
  let users = yield UserModel.findAll({where, order, limit})

  let res = []
  for (let user of users) {
    res.push(user.get({plain: true}))
  }

  return res
}

// 更新用户信息
exports.updateAsync = function* (userId, data) {
  let user = yield UserModel.findById(userId)
  if (!user) {
    return false
  }

  let fields = ['name', 'port', 'password', 'transferEnable', 'isAdmin', 'isLocked']
  user = yield user.update(data, {fields})
  return user.get({plain: true})
}

// 删除用户
exports.removeAsync = function* (userId) {
  let user = yield UserModel.findById(userId)
  if (!user) {
    return false
  }

  return yield user.destroy()
}
