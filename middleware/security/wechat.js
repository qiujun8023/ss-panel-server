'use strict';

const config = require('config');

const errors = require('../../lib/errors');
const birthdayService = require('../../service/birthday');

let getUserAsync = function* (app, user_id) {
  switch (app) {
    case 'birthday':
      return yield birthdayService.getUserAsync(user_id);
    default:
      return false;
  }
};

let getExtra = function (app) {
  switch (app) {
    case 'birthday':
      return {
        appid: config.wechat.tick.corpid,
        redirect_uri: config.base_url + 'api/birthday/oauth',
        response_type: 'code',
        scope: 'snsapi_base',
      };
    default:
      return {};
  }
};

module.exports = function (app) {
  return function* (req, res, next) {
    // 设置登陆用户、测试用
    if (config.env === 'test') {
      let user;
      let user_id = req.get('x-user-id');
      if (user_id) {
        user = yield getUserAsync(app, user_id);
      }

      // 如设置 user_id 则设置 session
      if (user) {
        req.session[app] = req.session[app] || {};
        req.session[app]['user'] = user;
        return next();
      } else if (app && user_id && !user) {
        throw new errors.NotFound('用户不存在');
      }
    }

    // 判断用户信息是否有效
    let session = req.session[app];
    if (!session || !session.user) {
      throw new errors.Unauthorized('登录后访问', 'Unauthorized', getExtra(app));
    }

    next();
  };
};
