'use strict';

const moment = require('moment');

let upyun = module.exports = {};

upyun.spider = function (data) {
  let date_format = 'YYYY-MM-DD HH:mm:ss';
  data.created_at = moment(data.created_at).format(date_format);
  data.updated_at = moment(data.updated_at).format(date_format);
  data.save_path = data.save_path || '';
  return data;
};
