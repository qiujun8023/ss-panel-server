'use strict';

const Sequelize = require('sequelize');

const sequelize = require('../../lib/sequelize')('shard');

module.exports = sequelize.define('log', {
  log_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: '日志 Id',
  },
  user_id: {
    type: Sequelize.STRING(30),
    allowNull: false,
    comment: '用户 Id',
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    comment: '内容',
  },
}, {
  updatedAt: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'birthday_log',
});
