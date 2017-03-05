'use strict';

const _ = require('lodash');

const random = require('../random');
const ssService = require('../../../service/ss');

let ss = module.exports = {};

ss.createTestUserAsync = function* (opts) {
  let data = _.assign({
    user_id: random.ss.getUserId(),
    name: random.ss.getUserName(),
  }, opts || {});

  return yield ssService.createUserAsync(data);
};

ss.removeTestUserAsync = function* (user) {
  return yield ssService.removeUserAsync(user.user_id);
};

ss.createTestNodeAsync = function* (opts) {
  let data = _.assign({
    name: random.ss.getNodeName(),
    avatar: random.ss.getNodeAvatar(),
    server: random.ss.getNodeServer(),
    method: random.ss.getNodeMethod(),
    description: random.ss.getNodeDescription(),
    sort: random.ss.getNodeSort(),
    is_visible: random.ss.getNodeIsVisible(),
  }, opts || {});

  return yield ssService.addNodeAsync(data);
};

ss.removeTestNodeAsync = function* (node) {
  return yield ssService.removeNodeAsync(node.node_id);
};
