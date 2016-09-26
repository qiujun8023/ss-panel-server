'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const procfs = Promise.promisifyAll(require('procfs-stats'));

const networkModel = require('../model/network');
const redis = require('../lib/redis')('network');
const sequelize = require('../lib/sequelize')('network');

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

// 插入一条数据
network._addAsync = function* (model, options) {
  let res = yield model.create(options);
  return _.isEmpty(res) ? false : res.id;
};

// 插入一条耗时数据
network.addTimeAsync = function* (options) {
  return yield this._addAsync(networkModel.Time, options);
};

// 插入一条网速数据
network.addSpeedAsync = function* (options) {
  return yield this._addAsync(networkModel.Speed, options);
};

// 填充空白数据
network._fillEmptyValue = function (data, res) {
  for (let item of data) {
    item = item.get({plain: true});
    for (let i = 0; i < res.length; i++) {
      if (item.period === res[i].period) {
        res[i] = item;
        break;
      }
    }
  }

  let ans = {};
  for (let i = 0; i < res.length; i++) {
    for (let k in res[i]) {
      ans[k] = ans[k] || [];
      ans[k].push(res[i][k]);
    }
  }

  return ans;
};

// 统计耗时
network._getCountAsync = function* (model, date, type, format, shifting, min, max) {
  let data = yield model.findAll({
    attributes: [
      [sequelize.cast(sequelize.fn('AVG', sequelize.col(type)), 'signed'), type],
      [sequelize.cast(sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), format), 'signed'), 'period'],
    ],
    where: {
      created_at: {
        $gt: date.toDate(),
        $lt: date.add(1, shifting).toDate(),
      },
    },
    group: 'period',
    order: 'period',
  });

  let res = [];
  for (let i = min; i <= max; i++) {
    let item = {period: i};
    item[type] = -1;
    res.push(item);
  }

  date.subtract(1, shifting);
  return this._fillEmptyValue(data, res);
};

// 按小时统计耗时
network.getTimeByHourAsync = function* (date) {
  return yield this._getCountAsync(networkModel.Time, date, 'time', '%k', 'days', 0, 23);
};

// 按天统计耗时
network.getTimeByDayAsync = function* (date) {
  return yield this._getCountAsync(networkModel.Time, date, 'time', '%e', 'months', 1, date.daysInMonth());
};

// 按小时统计速度
network.getSpeedByHourAsync = function* (date) {
  return yield this._getCountAsync(networkModel.Speed, date, 'speed', '%k', 'days', 0, 23);
};

// 按天统计速度
network.getSpeedByDayAsync = function* (date) {
  return yield this._getCountAsync(networkModel.Speed, date, 'speed', '%e', 'months', 1, date.daysInMonth());
};

// 获取流量提醒用户列表
network.getFlowRemindAsync = function* () {
  let users = yield networkModel.FlowRemind.findAll();

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
