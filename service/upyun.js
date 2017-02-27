'use strict';

const config = require('config');
const moment = require('moment');
const filesize = require('filesize');
const UpYun = require('node-upyun-sdk');

let upyun = module.exports = {};

upyun.instance = new UpYun(
  config.upyun.bucket,
  config.upyun.operator,
  config.upyun.password
);

upyun.sortFile = function (data) {
  data.sort(function (a, b) {
    if (a.type === 'F' && b.type !== 'F') {
      return -1;
    } else if (a.type !== 'F' && b.type === 'F') {
      return 1;
    }
    return a.name > b.name ? 1 : -1;
  });
  return data;
};

upyun.formatFile = function (data) {
  let time_format = 'YYYY-MM-DD HH:mm:ss';
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    item.size_v = filesize(item.size);
    item.time_v = moment.unix(item.time).format(time_format);
  }
  return data;
};

upyun.listFileAsync = function* (path) {
  let data = yield this.instance.readDir(path);
  return this.sortFile(this.formatFile(data));
};
