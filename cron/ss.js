'use strict';

const cron = require('../lib/cron');
const ssModel = require('../model/ss');

const UserModel = ssModel.User;

// 每月清空流量
let clearTransfer = cron('0 0 0 1 * *', function* () {
  yield UserModel.update({
    flow_up: 0,
    flow_down: 0,
  }, {
    silent: true,
    where: {},
  });
});

module.exports = {
  clearTransfer,
};
