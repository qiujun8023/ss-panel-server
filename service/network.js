'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const procfs = Promise.promisifyAll(require('procfs-stats'));

const networkModel = require('../model/network');
const redis = require('../lib/redis')('network');

let network = module.exports = {};

// 格式化
network.format = function (type, value) {
  let s = {
    size: ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'],
    speed: ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps', 'Pbps'],
  };

  if (!value) {
    return 0 + ' ' + s[type][0];
  }

  let e = Math.floor(Math.log(value) / Math.log(1024));
  return (value / Math.pow(1024, Math.floor(e))).toFixed(2) + ' ' + s[type][e];
};

// 获取流量提醒用户列表
network.getFlowRemindAsync = function* () {
  let users = yield networkModel.Remind.findAll();

  let res = [];
  for (let user of users) {
    res.push(user.user_id);
  }
  return res;
};

// 判断流量是否超过阀值
network.isFlowAbnormalAsync = function* (Interface) {
  let data = yield procfs.netAsync();

  let new_data;
  for (let item of data) {
    if (item.Interface === Interface) {
      new_data = {
        time: _.now(),
        receive: item.bytes.Receive,
        transmit: item.bytes.Transmit,
      };
      break;
    }
  }

  // 读取旧流量数据
  let old_data;
  try {
    old_data = JSON.parse(yield redis.get(`flow:${Interface}`));
  } catch (e) {
    old_data = false;
  }

  // 写入新流量数据
  yield redis.set(`flow:${Interface}`, JSON.stringify(new_data));
  if (!old_data || !new_data) {
    return false;
  }

  return {
    time_diff: new_data.time - old_data.time,
    receive_diff: new_data.receive - old_data.receive,
    transmit_diff: new_data.transmit - old_data.transmit,
    receive_total: new_data.receive,
    transmit_total: new_data.transmit,
  };
};
