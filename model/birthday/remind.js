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
  is_remind: {
    type: Sequelize.ENUM,
    values: ['Y', 'N'],
    defaultValue: 'N',
    allowNull: false,
    comment: '是否已经提醒',
    get: function () {
      let is_remind = this.getDataValue('is_remind');
      return is_remind === 'Y';
    },
    set: function (is_remind) {
      this.setDataValue('is_remind', is_remind ? 'Y' : 'N');
    },
  },
}, {
  underscored: true,
  freezeTableName: true,
  tableName: 'birthday_remind',
});
