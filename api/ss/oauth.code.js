'use strict';

const errors = require('../../lib/errors');
const wechat = require('../../lib/wechat')('tick', 'shard');
const ssService = require('../../service/ss');

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

    let name;
    try {
      let user = yield wechat.getUserAsync(user_id);
      name = user.name;
    } catch (err) {
      throw new errors.BadGateway(err.message || '请求微信服务器失败');
    }

    // 获取用户信息
    let user = yield ssService.getUserAsync(user_id);
    if (!user) {
      user = yield ssService.createUserAsync({user_id, name});
    } else {
      yield ssService.updateUserAsync(user_id, {name});
    }

    req.session.ss = req.session.ss || {};
    req.session.ss.user = user;

    res.redirect(state || '/ss');
  },
};
