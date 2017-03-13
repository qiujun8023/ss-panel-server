const translate = require('../../lib/translate');

require('moder')(__dirname, {
  naming: 'pascal',
  lazy: false,
  exports,
  filter: translate.isTest,
});

exports.User.sync();
exports.Node.sync();
exports.Transfer.sync();
exports.Offer.sync();

// 用户与流量的关系
exports.User.hasMany(exports.Transfer, {
  foreignKey: 'user_id',
  constraints: false,
});
exports.Transfer.belongsTo(exports.User, {
  foreignKey: 'user_id',
  constraints: false,
});

// 节点与流量的关系
exports.Node.hasMany(exports.Transfer, {
  foreignKey: 'node_id',
  constraints: false,
});
exports.Transfer.belongsTo(exports.Node, {
  foreignKey: 'node_id',
  constraints: false,
});
