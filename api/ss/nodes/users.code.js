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

    // 查询活跃用户
    let result = [];
    let node_id = req.query.node_id;
    let users = yield ss.findNodeUserAsync(node_id);
    for (let item of users) {
      result.push(format.nodeUser(item));
    }

    res.json(result);
  },
};
