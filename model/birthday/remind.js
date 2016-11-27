'use strict';

const Sequelize = require('sequelize');

const sequelize = require('../../lib/sequelize')('shard');

module.exports = sequelize.define('remind', {
  remind_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: '提醒 Id',
  },
  setting_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    comment: '设置 Id',
  },
  time: {
    type: Sequelize.DATE,
    allowNull: false,
    comment: '提醒时间',
  },
  is_remind: {
    type: Sequelize.ENUM,
    values: ['Y', 'N'],
    defaultValue: 'N',
    allowNull: false,
    comment: '是否已经提醒',
    get: function () {
      let is_paused = this.getDataValue('is_paused');
      return is_paused === 'Y';
    },
    set: function (is_paused) {
      this.setDataValue('is_paused', is_paused ? 'Y' : 'N');
    },
  },
}, {
  underscored: true,
  freezeTableName: true,
  tableName: 'birthday_remind',
});
