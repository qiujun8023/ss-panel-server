'use strict'

const config = require('config')
const winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')

let logger = new (winston.Logger)({
  transports: []
})

const consoleTransport = new (winston.transports.Console)({
  name: 'consoleTransport',
  prettyPrint: true,
  colorize: true
})

const fileTransport = new (DailyRotateFile)({
  name: 'fileTransport',
  colorize: false,
  timestamp: true,
  json: false,
  filename: config.logger.file.filename,
  maxsize: 1024 * 1024 * 100, // 100MB
  maxFiles: 1
  // datePattern: '.MM',
})

switch (config.env) {
  case 'development':
    logger.add(consoleTransport, null, true)
    logger.add(fileTransport, null, true)
    break
  case 'production':
    logger.add(fileTransport, null, true)
    break
  case 'test':
  default:
    // Do nothing during tests
    break
}

module.exports = logger
