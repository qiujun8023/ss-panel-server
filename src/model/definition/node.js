const Sequelize = require('sequelize')

const sequelize = require('../../lib/sequelize')

module.exports = sequelize.define('node', {
  nodeId: {
    type: Sequelize.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    field: 'id',
    comment: '主键'
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'name',
    comment: '节点名称'
  },
  avatar: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'avatar',
    comment: '节点头像'
  },
  server: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'server',
    comment: '节点地址'
  },
  method: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'method',
    comment: '加密方式'
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
    field: 'description',
    comment: '节点描述'
  },
  sort: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'sort',
    comment: '排序'
  },
  isVisible: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false,
    field: 'is_visible',
    comment: '是否可见'
  },
  activedAt: {
    type: Sequelize.DATE,
    allowNull: true,
    field: 'actived_at',
    comment: '节点最后在线时间'
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
  tableName: 'node',
  timestamps: true
})
