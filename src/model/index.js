const User = require('./user')
const Node = require('./node')
const NodeToken = require('./node_token')
const Traffic = require('./traffic')
const sequelize = require('../lib/sequelize')

// 用户与流量的关系
User.hasMany(Traffic, {
  foreignKey: 'userId',
  constraints: false
})
Traffic.belongsTo(User, {
  foreignKey: 'userId',
  constraints: false
})

// 节点与流量的关系
Node.hasMany(Traffic, {
  foreignKey: 'nodeId',
  constraints: false
})
Traffic.belongsTo(Node, {
  foreignKey: 'nodeId',
  constraints: false
})

// 节点与Token关系
Node.hasMany(NodeToken, {
  foreignKey: 'nodeId',
  constraints: false,
  as: 'token'
})
NodeToken.belongsTo(Node, {
  foreignKey: 'nodeId',
  constraints: false
})

// 同步数据到数据库
sequelize.sync()

module.exports = {
  User,
  Node,
  NodeToken,
  Traffic
}
