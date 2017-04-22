'use strict';

const Sequelize = require('sequelize');

const sequelize = require('../../lib/sequelize');

module.exports = sequelize.define('spider', {
  spider_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: '主键',
  },
  save_name: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '保存名称',
  },
  save_path: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    comment: '保存地址',
  },
  request_url: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '文件地址',
  },
  status: {
    type: Sequelize.ENUM,
    values: ['ADDED', 'DOWNLOADING', 'COMPLETE', 'FAILURE'],
    defaultValue: 'ADDED',
    allowNull: false,
    comment: '状态',
  },
}, {
  underscored: true,
  freezeTableName: true,
  tableName: 'upyun_spider',
});
