'use strict';

const _ = require('lodash');

const ss = require('../../service/ss');
const format = require('../../lib/format').ss;

module.exports = {
  *get(req, res) {
    let user_id = req.session.ss.user.user_id;
    let user = yield ss.getUserAsync(user_id);

    res.json(format.profile(user));
  },

  *put(req, res) {
    let user_id = req.session.ss.user.user_id;
    let data = _.pick(req.body, ['password']);

    let user = yield ss.updateUserAsync(user_id, data);
    res.json(format.profile(user));
  },
};
