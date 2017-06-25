'use strict'

const Sequelize = require('sequelize')

const sequelize = require('../lib/sequelize')

module.exports = sequelize.define('transfer', {
  transferId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: '流量 Id'
  },
  userId: {
    type: Sequelize.STRING(32),
    allowNull: false,
    comment: '用户 Id'
  },
  nodeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    comment: '节点 Id'
  },
  flowUp: {
    type: Sequelize.BIGINT,
    allowNull: false,
    defaultValue: 0,
    comment: '上传流量'
  },
  flowDown: {
    type: Sequelize.BIGINT,
    allowNull: false,
    defaultValue: 0,
    comment: '下载流量'
  },
  activeAt: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
    comment: '活跃时间'
  }
}, {
  createdAt: false,
  updatedAt: false,
  freezeTableName: true
})
