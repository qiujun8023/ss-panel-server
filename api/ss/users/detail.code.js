'use strict';

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

    // 查询用户
    user = yield ss.getUserAsync(req.query.user_id);
    if (!user) {
      throw new errors.NotFound('未找到相关用户');
    }

    res.json(format.user(user));
  },
};
