'use strict';

const _ = require('lodash');
const config = require('config');
const moment = require('moment');

const cron = require('../lib/cron');
const wechat = require('../lib/wechat');
const ssModel = require('../model/ss');
const ssService = require('../service/ss');

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

// 节点监控
const MAX_TIME_DIFF = 180000;
let nodeMonitor = cron('0 * * * * *', function* () {
  let nodes = yield ssService.findNodeAsync({
    active_at: {
      $ne: null,
    },
  });

  for (let node of nodes) {
    let new_status = {ok: true, active_at: node.active_at};
    let old_status = (yield ssService.getNodeStatusAsync(node.node_id)) || new_status;

    let message;
    let time_diff = moment().diff(node.active_at);
    new_status.ok = time_diff <= MAX_TIME_DIFF;
    if (!new_status.ok && old_status.ok) {
      message = `【${node.name}】(ID:${node.node_id})科学上网服务异常，请及时检查`;
    } else if (new_status.ok && !old_status.ok) {
      let long = moment(old_status.active_at).fromNow(true);
      message = `【${node.name}】(ID:${node.node_id})科学上网服务已恢复，本次服务中断时长 ${long}`;
    }

    if (message) {
      let users = yield ssService.findUserAsync({is_admin: true});
      let touser = _.map(users, 'user_id').join('|');
      yield wechat.sendAsync({touser}, {
        msgtype: 'text',
        text: {
          content: message,
        },
      });
    }

    yield ssService.setNodeStatusAsync(node.node_id, new_status);
  }
});

module.exports = {
  initUserTransfer,
  cleanTransferLogs,
  nodeMonitor,
};
