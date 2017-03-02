'use strict';

const _ = require('lodash');
const chance = require('chance')();
const config = require('config');
const Sequelize = require('sequelize');

const ssModel = require('../model/ss');
const sequelize = require('../lib/sequelize')('shard');
const errors = require('../lib/errors');

const UserModel = ssModel.User;
const NodeModel = ssModel.Node;

let ss = module.exports = {};

ss.randUniquePort = function (exist_ports, min_port, max_port) {
  for (let i = 0; i < 5; i++) {
    let port = _.random(min_port, max_port);
    if (exist_ports.indexOf(port) === -1) {
      return port;
    }
  }
  throw new errors.SystemError('未找到空闲端口');
};

ss.createUserAsync = function* (user_id) {
  return sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, function (t) {
    return UserModel.findAll({
      attributes: ['port'],
      transaction: t,
    })
    .then(function (users) {
      let ports = [];
      users.forEach(function (user) {
        ports.push(user.get('port'));
      });

      return ss.randUniquePort(ports, config.ss.min_port, config.ss.max_port);
    })
    .then(function (port) {
      let password = chance.string({length: 6, pool: config.ss.random_password_pool});
      let transfer_enable = config.ss.init_transfer_enable;
      return UserModel.create({user_id, port, password, transfer_enable}, {
        transaction: t,
      });
    })
    .then(function (user) {
      return user.get({plain: true});
    });
  });
};

ss.getUserAsync = function* (user_id) {
  let user = yield UserModel.findById(user_id);
  if (!user) {
    return false;
  }

  return user.get({plain: true});
};

ss.findUserAsync = function* () {
  let users = yield UserModel.findAll();

  let res = [];
  for (let user of users) {
    res.push(user.get({plain: true}));
  }

  return res;
};

ss.updateUserAsync = function* (user_id, data) {
  let user = yield UserModel.findById(user_id);
  if (!user) {
    return false;
  }

  user = yield user.update(data, {
    fields: ['port', 'password', 'transfer_enable', 'is_admin', 'is_locked'],
  });
  return user.get({plain: true});
};

ss.addNodeAsync = function* (data) {
  let node = yield NodeModel.create(data);
  return node.get({plain: true});
};

ss.getNodeAsync = function* (node_id) {
  let node = yield NodeModel.findById(node_id);
  if (!node) {
    return false;
  }

  return node.get({plain: true});
};

ss.findNodeAsync = function* () {
  let nodes = yield NodeModel.findAll();

  let res = [];
  for (let node of nodes) {
    res.push(node.get({plain: true}));
  }

  return res;
};

ss.updateNodeAsync = function* (node_id, data) {
  let node = yield NodeModel.findById(node_id);
  if (!node) {
    return false;
  }

  node = yield node.update(data);
  return node.get({plain: true});
};

ss.removeNodeAsync = function* (node_id) {
  let node = yield NodeModel.findById(node_id);
  if (!node) {
    return false;
  }

  return yield node.destroy();
};

ss.findServiceAsync = function* (user_id) {
  let user = yield this.getUserAsync(user_id);
  if (!user) {
    return false;
  }

  user = _.pick(user, ['port', 'password']);

  let res = [];
  let nodes = yield this.findNodeAsync();
  let filter = ['node_id', 'name', 'server', 'description', 'method'];
  nodes.forEach(function (node) {
    if (node.is_visible) {
      node = _.pick(node, filter);
      Object.assign(node, user);
      res.push(node);
    }
  });

  return res;
};

ss.getServiceAsync = function* (user_id, node_id) {
  let user = yield this.getUserAsync(user_id);
  if (!user) {
    return false;
  }

  let node = yield this.getNodeAsync(node_id);
  if (!node) {
    return false;
  }

  return {
    node_id: node.node_id,
    name: node.name,
    server: node.server,
    port: user.port,
    method: node.method,
    password: user.password,
    description: node.description,
  };
};
