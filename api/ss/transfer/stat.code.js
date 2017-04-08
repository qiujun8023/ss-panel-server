'use strict';

const _ = require('lodash');

const ss = require('../../../service/ss');
const format = require('../../../lib/format').ss;

module.exports = {
  *get(req, res) {
    let user_id = req.session.ss.user.user_id;

    let where;
    let user = yield ss.getUserAsync(user_id);
    if (user.is_admin) {
      where = _.pick(req.query, ['node_id', 'user_id']);
    }
    if (!where.node_id && !where.user_id) {
      where = {user_id};
    }

    let result = [];
    let data = yield ss.findTransferStatAsync(where);
    for (let item of data) {
      result.push(format.transferStat(item));
    }

    res.json(result);
  },
};
