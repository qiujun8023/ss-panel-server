'use strict';

const config = require('config');

const errors = require('../lib/errors');
const birthdayService = require('../service/birthday');

let getBirthdayUser = function* (user_id) {
  return yield birthdayService.getUserAsync(user_id);
};

module.exports = function () {
  return function* (req, res, next) {
    // 设置登陆用户、测试用
    if (config.env === 'test') {
      let user;
      let item = req.get('x-item');
      let user_id = req.get('x-user-id');
      switch (item) {
        case 'birthday':
          user = yield getBirthdayUser(user_id);
          break;
      }

      // 如设置 user_id 则设置 session
      if (item && user_id && !user) {
        throw new errors.NotFound('用户不存在');
      }

      req.session.user = user;
      return next();
    }

    req.session.user = {user_id: '1305010119'};
    next();
  };
};
