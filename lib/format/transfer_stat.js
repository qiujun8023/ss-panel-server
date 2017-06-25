'use strict'

const _ = require('lodash')
const filesize = require('filesize')

module.exports = function (data) {
  let filter = [
    'date',
    'flowUp',
    'flowUpV',
    'flowDown',
    'flowDownV',
    'flowTotal',
    'flowTotalV'
  ]
  data.flowUpV = filesize(data.flowUp)
  data.flowDownV = filesize(data.flowDown)
  data.flowTotal = data.flowUp + data.flowDown
  data.flowTotalV = filesize(data.flowTotal)
  return _.pick(data, filter)
}
