'use strict';

const moment = require('moment');
const config = require('config');

moment.locale('zh-cn');

let upyun = module.exports = {};

upyun.spider = function (data) {
  let date_format = 'YYYY-MM-DD HH:mm:ss';
  data.from_now = moment(data.created_at).fromNow();
  data.created_at = moment(data.created_at).format(date_format);
  data.updated_at = moment(data.updated_at).format(date_format);
  data.save_url = config.upyun.base_url + data.save_path;
  return data;
};
