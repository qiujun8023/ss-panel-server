'use strict';

const _ = require('lodash');

const ss = require('../../../service/ss');
const errors = require('../../../lib/errors');
const format = require('../../../lib/format').ss;

module.exports = {
  *get(req, res) {
    let user_id = req.session.ss.user.user_id;

    // 当前用户
    let user = yield ss.getUserAsync(user_id);
    if (!user.is_admin) {
      throw new errors.Forbidden('无权访问');
    }

    let result = [];
    let where = _.pick(req.query, ['node_id', 'user_id']);
    let data = yield ss.findTransferStatAsync(where);
    for (let item of data) {
      result.push(format.transferStat(item));
    }

    res.json(result);
  },
};
