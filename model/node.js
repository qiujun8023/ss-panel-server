'use strict'

const Sequelize = require('sequelize')

const sequelize = require('../lib/sequelize')

module.exports = sequelize.define('node', {
  nodeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: '节点 Id'
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '节点名称'
  },
  avatar: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '节点头像'
  },
  server: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '节点地址'
  },
  method: {
    type: Sequelize.STRING(64),
    allowNull: false,
    comment: '加密方式'
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
    comment: '节点描述'
  },
  sort: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '排序'
  },
  isVisible: {
    type: Sequelize.ENUM,
    values: ['Y', 'N'],
    defaultValue: 'Y',
    allowNull: false,
    comment: '是否可见',
    get: function () {
      let isVisible = this.getDataValue('isVisible')
      return isVisible === 'Y'
    },
    set: function (isVisible) {
      this.setDataValue('isVisible', isVisible ? 'Y' : 'N')
    }
  },
  activeAt: {
    type: 'TIMESTAMP',
    allowNull: true,
    comment: '节点最后在线时间'
  }
}, {
  freezeTableName: true
})
