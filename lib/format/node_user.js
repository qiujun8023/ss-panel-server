'use strict'

const _ = require('lodash')
const moment = require('moment')

module.exports = function (data) {
  let filter = ['userId', 'name', 'activeAt']
  data.activeAt = moment(data.activeAt).fromNow()
  return _.pick(data, filter)
}
