'use strict'

const moment = require('moment')

module.exports = function (data) {
  delete data.activeAt
  data.createdAt = moment(data.createdAt).fromNow()
  data.updatedAt = moment(data.updatedAt).fromNow()
  return data
}
