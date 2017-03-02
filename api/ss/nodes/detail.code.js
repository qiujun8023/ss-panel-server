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
    let node_id = req.query.node_id;
    let node = yield ss.getNodeAsync(node_id);
    if (!node) {
      throw new errors.NotFound('未找到相关节点');
    }

    res.json(format.node(node));
  },
};
