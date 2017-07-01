'use strict'

const config = require('config')

const logger = require('../lib/logger')

module.exports = function () {
  // eslint-disable-next-line
  return function (err, req, res, next) {
    if (typeof err === 'string') {
      err = {message: err}
    }

    err.type = err.type || 'SystemError'
    if (err.type === 'SystemError') {
      logger.error(err)
    } else if (config.env === 'development') {
      logger.error(err)
    }

    let answer = {}
    if (err.extra) {
      answer.extra = err.extra
    }

    answer.type = err.type
    answer.message = err.message
    answer.request = err.request || req.path
    res.status(err.status || 500).send(answer)
  }
}
