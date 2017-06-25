'use strict'

const _ = require('lodash')

module.exports = function (data) {
  let filter = ['offerId', 'name', 'url', 'sort']
  return _.pick(data, filter)
}
