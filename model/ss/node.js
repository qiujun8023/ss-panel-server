'use strict';

const Sequelize = require('sequelize');

const sequelize = require('../../lib/sequelize')('shard');

module.exports = sequelize.define('node', {
  node_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: '节点 Id',
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '节点名称',
  },
  avatar: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '节点头像',
  },
  server: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '节点地址',
  },
  method: {
    type: Sequelize.STRING(64),
    allowNull: false,
    comment: '加密方式',
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
    comment: '节点描述',
  },
  sort: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '排序',
  },
  is_visible: {
    type: Sequelize.ENUM,
    values: ['Y', 'N'],
    defaultValue: 'Y',
    allowNull: false,
    comment: '是否可见',
    get: function () {
      let is_visible = this.getDataValue('is_visible');
      return is_visible === 'Y';
    },
    set: function (is_visible) {
      this.setDataValue('is_visible', is_visible ? 'Y' : 'N');
    },
  },
}, {
  underscored: true,
  freezeTableName: true,
  tableName: 'ss_node',
});
