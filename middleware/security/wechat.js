'use strict';

const config = require('config');

const ss = require('../../service/ss');
const birthday = require('../../service/birthday');
const errors = require('../../lib/errors');

let getUserAsync = function* (app, user_id) {
  switch (app) {
    case 'ss':
      return yield ss.getUserAsync(user_id);
    case 'birthday':
      return yield birthday.getUserAsync(user_id);
    default:
      return false;
  }
};

let getExtra = function (app) {
  let base = {
    appid: config.wechat.tick.corpid,
    response_type: 'code',
    scope: 'snsapi_base',
  };
  switch (app) {
    case 'ss':
      base.redirect_uri = config.base_url + 'api/ss/oauth';
      return base;
    case 'birthday':
      base.redirect_uri = config.base_url + 'api/birthday/oauth';
      return base;
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
