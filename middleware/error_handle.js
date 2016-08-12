'use strict';

const config = require('config');

const logger = require('../lib/logger');

// eslint-disable-next-line
module.exports = function (err, req, res, next) {
  if (typeof err === 'string') {
    err = {message: err};
  }
  err.type = err.type || 'SystemError';

  if (err.type === 'SystemError') {
    logger.error(err);
  } else if (config.debug) {
    logger.error(err);
  }

  let answer = {};
  answer.type = err.type;
  answer.message = err.message;

  res.status(err.status || 500);

  res.send(answer);
};
