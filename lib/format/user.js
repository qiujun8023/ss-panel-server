'use strict'

const _ = require('lodash')
const moment = require('moment')
const filesize = require('filesize')

module.exports = function (data) {
  let filter = [
    'userId',
    'name',
    'port',
    'password',
    'flowUp',
    'flowUpV',
    'flowDown',
    'flowDownV',
    'transferUsed',
    'transferUsedV',
    'transferEnable',
    'transferEnableV',
    'isAdmin',
    'isLocked',
    'activeAt',
    'registAt'
  ]

  data.transferEnableV = filesize(data.transferEnable)
  data.transferUsed = data.flowUp + data.flowDown
  data.transferUsedV = filesize(data.transferUsed)
  data.flowUpV = filesize(data.flowUp)
  data.flowDownV = filesize(data.flowDown)
  data.activeAt = moment(data.activeAt).fromNow()
  data.registAt = moment(data.registAt).fromNow()

  return _.pick(data, filter)
}
