'use strict';

const config = require('config');

const cron = require('../lib/cron');
const ssModel = require('../model/ss');

const UserModel = ssModel.User;
const TransferModel = ssModel.Transfer;

// 每月清空流量
let initUserTransfer = cron('0 0 0 1 * *', function* () {
  yield UserModel.update({
    flow_up: 0,
    flow_down: 0,
  }, {
    silent: true,
    where: {},
  });
});

// 清理过期日志
let cleanTransferLogs = cron('0 0 * * * *', function* () {
  let days = config.ss.transfer_log_save_days;
  let ms = days * 24 * 60 * 60 * 1000;
  yield TransferModel.destroy({
    where: {
      active_at: {
        $lt: new Date(new Date() - ms),
      },
    },
  });
});

module.exports = {
  initUserTransfer,
  cleanTransferLogs,
};
