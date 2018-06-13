const Config = require('./config')
const User = require('./user')
const Node = require('./node')
const NodeToken = require('./node_token')
const Traffic = require('./traffic')

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

module.exports = {
  Config,
  User,
  Node,
  NodeToken,
  Traffic
}
