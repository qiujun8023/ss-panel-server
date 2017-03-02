'use strict';

const _ = require('lodash');

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

    let users = yield ss.findUserAsync();
    for (let i = 0; i < users.length; i++) {
      users[i] = format.user(users[i]);
    }
    res.json(users);
  },

  *put(req, res) {
    let user_id = req.session.ss.user.user_id;

    yield checkAuthAsync(user_id);

    let data = _.pick(req.body, ['port', 'password', 'transfer_enable', 'is_admin', 'is_locked']);
    let user = yield ss.updateUserAsync(req.body.user_id, data);
    res.json(format.user(user));
  },
};
