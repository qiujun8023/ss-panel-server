'use strict';

const _ = require('lodash');

const ss = require('../../service/ss');
const errors = require('../../lib/errors');
const format = require('../../lib/format').ss;

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

    let result = [];
    let nodes = yield ss.findNodeAsync();
    for (let node of nodes) {
      result.push(format.node(node));
    }
    res.json(result);
  },

  *put(req, res) {
    let user_id = req.session.ss.user.user_id;

    yield checkAuthAsync(user_id);

    let node_id = req.body.node_id;
    let data = _.pick(req.body, ['name', 'avatar', 'server', 'description', 'method', 'is_visible', 'sort']);

    // 获取节点信息
    let node = yield ss.getNodeAsync(node_id);
    if (!node) {
      throw new errors.NotFound('未找到相关设置');
    }

    // 更新节点
    node = yield ss.updateNodeAsync(node_id, data);
    res.json(format.node(node));
  },

  *post(req, res) {
    let user_id = req.session.ss.user.user_id;

    yield checkAuthAsync(user_id);

    let data = _.pick(req.body, ['name', 'avatar', 'server', 'description', 'method', 'is_visible', 'sort']);
    let node = yield ss.addNodeAsync(data);
    res.status(201).json(format.node(node));
  },

  *delete(req, res) {
    let user_id = req.session.ss.user.user_id;

    yield checkAuthAsync(user_id);


    // 获取节点信息
    let node_id = req.query.node_id;
    let node = yield ss.getNodeAsync(node_id);
    if (!node) {
      throw new errors.NotFound('未找到相关节点');
    }

    // 删除设置
    yield ss.removeNodeAsync(node_id);
    res.json({result: true});
  },
};
