'use strict'

const moment = require('moment')

const models = require('../model')
const sequelize = require('../lib/sequelize')

const TransferModel = models.Transfer

exports.findStatAsync = function* (where) {
  let date = moment()
  where = where || {}
  where.activeAt = {$gt: date.subtract(30, 'days').toDate()}
  let data = yield TransferModel.findAll({
    where,
    attributes: [
      [sequelize.fn('SUM', sequelize.col('flowUp')), 'flowUp'],
      [sequelize.fn('SUM', sequelize.col('flowDown')), 'flowDown'],
      [sequelize.fn('DATE_FORMAT', sequelize.col('activeAt'), '%m-%d'), 'date']
    ],
    group: 'date'
  })

  let res = []
  let dates = []
  for (let item of data) {
    item = item.get({plain: true})
    res.push(item)
    dates.push(item.date)
  }

  // 填写不存在的日期
  for (let i = 0; i <= 30; i++) {
    let tmpDate = date.format('MM-DD')
    if (dates[i] !== tmpDate) {
      res.splice(i, 0, {
        flowUp: 0,
        flowDown: 0,
        date: tmpDate
      })
      dates.splice(i, 0, tmpDate)
    }
    date.add(1, 'day')
  }
  return res
}
