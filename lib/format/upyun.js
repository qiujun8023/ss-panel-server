'use strict';

const moment = require('moment');
const config = require('config');

let upyun = module.exports = {};

upyun.spider = function (data) {
  data.created_at = moment(data.created_at).fromNow();
  data.updated_at = moment(data.updated_at).fromNow();
  data.save_url = config.upyun.base_url + data.save_path;
  return data;
};
