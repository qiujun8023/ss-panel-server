'use strict';

const Sequelize = require('sequelize');

const sequelize = require('../../lib/sequelize')('shard');

module.exports = sequelize.define('setting', {
  setting_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: '日期 Id',
  },
  birth_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    comment: '生日 Id',
  },
  advance: {
    type: Sequelize.INTEGER,
    allowNull: false,
    comment: '提前的天数',
  },
  time: {
    type: Sequelize.TIME,
    allowNull: false,
    comment: '提醒的时间',
  },
}, {
  underscored: true,
  freezeTableName: true,
  tableName: 'birthday_setting',
});
