'use strict';

const _ = require('lodash');
const config = require('config');

const ss = require('../../service/ss');
const format = require('../../lib/format').ss;
const errors = require('../../lib/errors');

let checkAuthAsync = function* (user_id) {
  let user = yield ss.getUserAsync(user_id);
  if (!user.is_admin) {
    throw new errors.Forbidden('无权访问');
  }
};

module.exports = {
  *get(req, res) {
    let user_id = req.session.ss.user.user_id;

    yield checkAuthAsync(user_id);

    let users = yield ss.findUserAsync({}, 'active_at desc');
    for (let i = 0; i < users.length; i++) {
      users[i] = format.user(users[i]);
    }
    res.json(users);
  },

  *put(req, res) {
    let user_id = req.session.ss.user.user_id;

    yield checkAuthAsync(user_id);

    let min_port = config.ss.min_port;
    let max_port = config.ss.max_port;
    let data = _.pick(req.body, ['port', 'password', 'transfer_enable', 'is_admin', 'is_locked']);
    if (data.port && (data.port < min_port || data.port > max_port)) {
      throw new errors.BadRequest(`端口号需在 ${min_port} - ${max_port} 范围内`);
    } else if (data.transfer_enable <= 0) {
      throw new errors.BadRequest('流量限额无效');
    }

    let user = yield ss.updateUserAsync(req.body.user_id, data);
    if (!user) {
      throw new errors.NotFound('未找到相关用户');
    }

    res.json(format.user(user));
  },
};
