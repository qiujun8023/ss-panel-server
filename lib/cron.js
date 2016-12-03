'use strict';

const co = require('co');
const CronJob = require('cron').CronJob;

const logger = require('./logger');

module.exports = function (time, action) {
  return new CronJob(time, function () {
    return co(action).then().catch(logger.error);
  });
};
