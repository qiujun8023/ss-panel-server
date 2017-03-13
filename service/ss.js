'use strict';

const _ = require('lodash');
const moment = require('moment');
const chance = require('chance')();
const config = require('config');
const Sequelize = require('sequelize');

const ssModel = require('../model/ss');
const sequelize = require('../lib/sequelize')('shard');
const errors = require('../lib/errors');

const UserModel = ssModel.User;
const NodeModel = ssModel.Node;
const OfferModel = ssModel.Offer;
const TransferModel = ssModel.Transfer;

let ss = module.exports = {};

// 随机空闲端口
ss.randUniquePort = function (exist_ports, min_port, max_port) {
  for (let i = 0; i < 5; i++) {
    let port = _.random(min_port, max_port);
    if (exist_ports.indexOf(port) === -1) {
      return port;
    }
  }
  throw new errors.SystemError('未找到空闲端口');
};

// 创建用户
ss.createUserAsync = function* (data) {
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
      Object.assign(data, {port, password, transfer_enable});
      return UserModel.create(data, {transaction: t});
    })
    .then(function (user) {
      return user.get({plain: true});
    });
  });
};

// 获取用户信息
ss.getUserAsync = function* (user_id) {
  let user = yield UserModel.findById(user_id);
  if (!user) {
    return false;
  }

  return user.get({plain: true});
};

// 获取用户列表
ss.findUserAsync = function* () {
  let users = yield UserModel.findAll();

  let res = [];
  for (let user of users) {
    res.push(user.get({plain: true}));
  }

  return res;
};

// 更新用户信息
ss.updateUserAsync = function* (user_id, data) {
  let user = yield UserModel.findById(user_id);
  if (!user) {
    return false;
  }

  user = yield user.update(data, {
    fields: ['name', 'port', 'password', 'transfer_enable', 'is_admin', 'is_locked'],
  });
  return user.get({plain: true});
};

// 删除用户
ss.removeUserAsync = function* (user_id) {
  let user = yield UserModel.findById(user_id);
  if (!user) {
    return false;
  }

  return yield user.destroy();
};

// 添加节点
ss.addNodeAsync = function* (data) {
  let node = yield NodeModel.create(data);
  return node.get({plain: true});
};

// 获取节点
ss.getNodeAsync = function* (node_id) {
  let node = yield NodeModel.findById(node_id);
  if (!node) {
    return false;
  }

  return node.get({plain: true});
};

// 获取节点列表
ss.findNodeAsync = function* () {
  let nodes = yield NodeModel.findAll({order: 'sort'});

  let res = [];
  for (let node of nodes) {
    res.push(node.get({plain: true}));
  }

  return res;
};

// 更新节点
ss.updateNodeAsync = function* (node_id, data) {
  let node = yield NodeModel.findById(node_id);
  if (!node) {
    return false;
  }

  node = yield node.update(data);
  return node.get({plain: true});
};

// 删除节点
ss.removeNodeAsync = function* (node_id) {
  let node = yield NodeModel.findById(node_id);
  if (!node) {
    return false;
  }
  return yield node.destroy();
};

// 获取服务列表
ss.findServiceAsync = function* (user_id) {
  let user = yield this.getUserAsync(user_id);
  if (!user) {
    return false;
  }

  user = _.pick(user, ['port', 'password']);

  let res = [];
  let nodes = yield this.findNodeAsync();
  let filter = ['node_id', 'name', 'avatar', 'server', 'description', 'method'];
  nodes.forEach(function (node) {
    if (node.is_visible) {
      node = _.pick(node, filter);
      Object.assign(node, user);
      res.push(node);
    }
  });

  return res;
};

// 获取服务详情
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
    avatar: node.avatar,
    server: node.server,
    port: user.port,
    method: node.method,
    password: user.password,
    description: node.description,
  };
};

ss.findNodeUserAsync = function* (node_id) {
  let data = yield TransferModel.findAll({
    attributes: [
      'user_id',
      [sequelize.fn('MAX', sequelize.col('transfer.active_at')), 'active_at'],
    ],
    where: {
      node_id,
      $or: {
        flow_up: {
          $gte: 1024,
        },
        flow_down: {
          $gte: 1024,
        },
      },
    },
    group: 'user_id',
    order: 'active_at DESC',
  });
  let users = yield this.findUserAsync();

  let res = [];
  for (let item of data) {
    let name = '未知';
    for (let user of users) {
      if (item.user_id === user.user_id) {
        name = user.name;
        break;
      }
    }
    res.push({
      name,
      user_id: item.user_id,
      active_at: item.active_at,
    });
  }

  return res;
};

ss.findTransferStatAsync = function* (where) {
  let date = moment();
  where = where || {};
  where.active_at = {$gt: date.subtract(30, 'days').toDate()};
  let data = yield TransferModel.findAll({
    where,
    attributes: [
      [sequelize.fn('SUM', sequelize.col('flow_up')), 'flow_up'],
      [sequelize.fn('SUM', sequelize.col('flow_down')), 'flow_down'],
      [sequelize.fn('DATE_FORMAT', sequelize.col('active_at'), '%m-%d'), 'date'],
    ],
    group: 'date',
  });

  let res = [];
  let dates = [];
  for (let item of data) {
    item = item.get({plain: true});
    res.push(item);
    dates.push(item.date);
  }

  // 填写不存在的日期
  for (let i = 0; i <= 30; i++) {
    let tmp_date = date.format('MM-DD');
    if (dates[i] !== tmp_date) {
      res.splice(i, 0, {
        flow_up: 0,
        flow_down: 0,
        date: tmp_date,
      });
      dates.splice(i, 0, tmp_date);
    }
    date.add(1, 'day');
  }
  return res;
};

// 获取赞助信息
ss.findOfferAsync = function* () {
  let offers = yield OfferModel.findAll();

  let res = [];
  for (let offer of offers) {
    res.push(offer.get({plain: true}));
  }

  return res;
};
