'use strict';

const _ = require('lodash');
const errors = require('../../lib/errors');
const wechat = require('../../lib/wechat')('tick', 'shard');
const birthdayService = require('../../service/birthday');

module.exports = {
  *get(req, res) {
    let code = req.query.code;
    let state = req.query.state;

    let user_id;
    try {
      let user = yield wechat.getUserIdByCodeAsync(code);
      user_id = user.UserId;
    } catch (err) {
      throw new errors.BadRequest(err.message);
    }

    let user;
    try {
      user = yield wechat.getUserAsync(user_id);
      if (user.gender === '1') {
        user.gender = '男';
      } else if (user.gender === '2') {
        user.gender = '女';
      } else {
        user.gender = '未知';
      }
      user = _.pick(user, ['name', 'gender', 'mobile', 'email', 'avatar']);
      user.user_id = user_id;
    } catch (err) {
      throw new errors.BadGateway(err.message || '请求微信服务器失败');
    }

    user = yield birthdayService.addOrUpdateUserAsync(user);
    req.session.birthday = req.session.birthday || {};
    req.session.birthday.user = user;

    res.redirect(state || '/birthday');
  },
};
