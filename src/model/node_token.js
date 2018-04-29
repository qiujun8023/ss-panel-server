const Sequelize = require('sequelize')

const sequelize = require('../lib/sequelize')

module.exports = sequelize.define('node_token', {
  nodeTokenId: {
    type: Sequelize.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    field: 'id',
    comment: '主键'
  },
  nodeId: {
    type: Sequelize.BIGINT,
    allowNull: false,
    field: 'node_id',
    comment: 'node主键'
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'token',
    comment: 'Token'
  },
  isEnabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false,
    field: 'is_enabled',
    comment: '是否启用'
  },
  activedAt: {
    type: Sequelize.DATE,
    allowNull: true,
    field: 'actived_at',
    comment: 'Token最后使用时间'
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    field: 'created_at',
    comment: '创建时间'
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    field: 'updated_at',
    comment: '更新时间'
  }
}, {
  tableName: 'node_token',
  timestamps: true,
  indexes: [
    {
      unique: false,
      fields: ['node_id']
    },
    {
      unique: true,
      fields: ['token']
    }
  ]
})
