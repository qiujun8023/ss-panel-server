'use strict'

const config = require('config')

const cron = require('../lib/cron')
const models = require('../model')

const TransferModel = models.Transfer

// 清理过期日志
let _fn = cron('0 0 * * * *', function* () {
  let days = config.ss.transferLogSaveDays
  let ms = days * 24 * 60 * 60 * 1000
  yield TransferModel.destroy({
    where: {
      activeAt: {
        $lt: new Date(new Date() - ms)
      }
    }
  })
})

module.exports = cron('0 0 * * * *', _fn)
