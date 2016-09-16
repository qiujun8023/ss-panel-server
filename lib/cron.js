'use strict';

const co = require('co');
const CronJob = require('cron').CronJob;

module.exports = function (time, action) {
  let cron = new CronJob(time, function () {
    return co(action).then();
  });
  cron._action = action;
  return cron;
};
