'use strict';

const _ = require('lodash');
const config = require('config');

const ss = require('../../service/ss');
const errors = require('../../lib/errors');
const format = require('../../lib/format').ss;

module.exports = {
  *get(req, res) {
    let user_id = req.session.ss.user.user_id;
    let user = yield ss.getUserAsync(user_id);

    res.json(format.user(user));
  },

  *put(req, res) {
    let user_id = req.session.ss.user.user_id;
    let data = _.pick(req.body, ['port', 'password']);

    let min_port = config.ss.min_port;
    let max_port = config.ss.max_port;
    if (data.port && (data.port < min_port || data.port > max_port)) {
      throw new errors.BadRequest(`端口号需在 ${min_port} - ${max_port} 范围内`);
    }

    let user;
    try {
      user = yield ss.updateUserAsync(user_id, data);
    } catch (err) {
      throw new errors.BadRequest('修改失败，可能端口已存在');
    }

    res.json(format.user(user));
  },
};
