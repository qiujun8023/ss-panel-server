'use strict';

// const _ = require('lodash');
// const moment = require('moment');
//
// const errors = require('../../lib/errors');
const birthday = require('../../service/birthday');

// 获取生日列表

// 修改生日

// 删除生日

// 添加生日

// 获取设置列表

// 添加设置

// 删除设置

// 每天计划从设置中列表计算并放到提醒中

// 每分钟从提醒中拿出来计算判断是否提醒并写入日志


module.exports = {
  *get(req, res) {
    let user_id = req.session.user.user_id;
    let births = yield birthday.findBirthAsync(user_id);
    res.json(births);
  },
  *post(req, res) {
    res.json({});
  },
  *put(req, res) {
    res.json({});
  },
  *delete(req, res) {
    res.json({});
  },
};
