'use strict'

const cron = require('../lib/cron')
const models = require('../model')

const UserModel = models.User

// 清空流量
let _fn = function* () {
  yield UserModel.update({
    flowUp: 0,
    flowDown: 0
  }, {
    silent: true,
    where: {}
  })
}

// 每月一号执行
module.exports = cron('0 0 0 1 * *', _fn)
