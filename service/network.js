'use strict';

const _ = require('lodash');

const networkModel = require('../model/network');
const sequelize = require('../lib/sequelize')('network');

let network = module.exports = {};

// 格式化
network.format = function (bps) {
  let s = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps', 'Pbps'];
  let e = Math.floor(Math.log(bps) / Math.log(1024));
  return (bps / Math.pow(1024, Math.floor(e))).toFixed(2) + ' ' + s[e];
};

// 插入一条数据
network.addInfoAsync = function* (options) {
  let res = yield networkModel.Info.create(options);
  return _.isEmpty(res) ? false : res.id;
};

// 填充统计数据
network._fillEmptyInfoValue = function (data, max) {
  let res = [];
  let values = [];
  for (let item of data) {
    item = item.get({plain: true});
    res.push(item);
    values.push(item.value);
  }
  for (let i = 0; i < max; i++) {
    if (values.indexOf(i) === -1) {
      res.push({value: i, max: 0, min: 0, avg: 0});
    }
  }
  return res.sort((a, b) => a.value > b.value ? 1 : -1);
};

// 按天统计
network.getInfoByHourAsync = function* (date) {
  let data = yield networkModel.Info.findAll({
    attributes: [
      [sequelize.fn('MAX', sequelize.col('speed')), 'max'],
      [sequelize.fn('MIN', sequelize.col('speed')), 'min'],
      [sequelize.cast(sequelize.fn('AVG', sequelize.col('speed')), 'signed'), 'avg'],
      [sequelize.cast(sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%k'), 'signed'), 'value'],
    ],
    where: {
      created_at: {
        $gt: date.toDate(),
        $lt: date.add(1, 'days').toDate(),
      },
    },
    group: 'value',
  });

  return this._fillEmptyInfoValue(data, 24);
};

// 按月统计
network.getInfoByDayAsync = function* (date) {
  let data = yield networkModel.Info.findAll({
    attributes: [
      [sequelize.fn('MAX', sequelize.col('speed')), 'max'],
      [sequelize.fn('MIN', sequelize.col('speed')), 'min'],
      [sequelize.cast(sequelize.fn('AVG', sequelize.col('speed')), 'signed'), 'avg'],
      [sequelize.cast(sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%e'), 'signed'), 'value'],
    ],
    where: {
      created_at: {
        $gt: date.toDate(),
        $lt: date.add(1, 'month').toDate(),
      },
    },
    group: 'value',
  });

  let max = date.subtract(1, 'month').daysInMonth();
  return this._fillEmptyInfoValue(data, max);
};
