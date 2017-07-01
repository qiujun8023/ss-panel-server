'use strict'

const config = require('config')
const winston = require('winston')

let logger = new (winston.Logger)({
  transports: []
})

const consoleTransport = new (winston.transports.Console)({
  name: 'consoleTransport',
  prettyPrint: true,
  colorize: true
})

if (config.env !== 'test') {
  logger.add(consoleTransport, null, true)
}

module.exports = logger
