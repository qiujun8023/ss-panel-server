'use strict';

const config = require('config');
const moment = require('moment');
const filesize = require('filesize');
const UpYun = require('upyun');
const Promise = require('bluebird');

let upyun = module.exports = {};

upyun.instance = Promise.promisifyAll(
  new UpYun(
    config.upyun.bucket,
    config.upyun.operator,
    config.upyun.password,
    config.upyun.endpoint,
    {apiVersion: 'v2'}
  )
);

upyun.checkRequest = function (res) {
  if (res.statusCode !== 200) {
    throw new Error(JSON.stringify(res.data));
  }
};

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

let listDirAsync = upyun.instance.listDirAsync.bind(upyun.instance);
upyun.listDirAsync = function* (path) {
  let res = yield listDirAsync(path, 999999, 'asc', 0);
  this.checkRequest(res);

  if (!res.data) {
    return [];
  }

  let files = [];
  let lines = res.data.split('\n');
  for (let line of lines) {
    let attrs = line.split('\t');
    files.push({
      name: attrs[0],
      type: attrs[1],
      size: attrs[2],
      time: attrs[3],
    });
  }

  return this.sortFile(this.formatFile(files));
};

let makeDirAsync = upyun.instance.makeDirAsync.bind(upyun.instance);
upyun.makeDirAsync = function* (path) {
  let res = yield makeDirAsync(path);
  this.checkRequest(res);
  return true;
};

let removeDirAsync = upyun.instance.removeDirAsync.bind(upyun.instance);
upyun.removeDirAsync = function* (remote_path) {
  let res = yield removeDirAsync(remote_path);
  this.checkRequest(res);
  return true;
};

let putFileAsync = upyun.instance.putFileAsync.bind(upyun.instance);
upyun.putFileAsync = function* (remote_path, local_file, opts) {
  let res = yield putFileAsync(remote_path, local_file, null, false, opts);
  this.checkRequest(res);
  return true;
};

let deleteFileAsync = upyun.instance.deleteFileAsync.bind(upyun.instance);
upyun.deleteFileAsync = function* (remote_path) {
  let res = yield deleteFileAsync(remote_path);
  this.checkRequest(res);
  return true;
};
