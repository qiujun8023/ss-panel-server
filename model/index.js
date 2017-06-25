require('moder')(__dirname, {
  naming: 'pascal',
  lazy: false,
  exports
})

exports.User.sync()
exports.Node.sync()
exports.Transfer.sync()
exports.Offer.sync()

// 用户与流量的关系
exports.User.hasMany(exports.Transfer, {
  foreignKey: 'userId',
  constraints: false
})
exports.Transfer.belongsTo(exports.User, {
  foreignKey: 'userId',
  constraints: false
})

// 节点与流量的关系
exports.Node.hasMany(exports.Transfer, {
  foreignKey: 'nodeId',
  constraints: false
})
exports.Transfer.belongsTo(exports.Node, {
  foreignKey: 'nodeId',
  constraints: false
})
