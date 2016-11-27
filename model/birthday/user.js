'use strict';

const Sequelize = require('sequelize');

const sequelize = require('../../lib/sequelize')('shard');

module.exports = sequelize.define('user', {
  user_id: {
    type: Sequelize.STRING(30),
    allowNull: false,
    primaryKey: true,
    comment: '用户 Id',
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '姓名',
  },
  gender: {
    type: Sequelize.ENUM,
    values: ['UNKNOWN', 'MAN', 'WOMAN'],
    defaultValue: 'UNKNOWN',
    allowNull: false,
    comment: '性别',
    get: function () {
      let transform = {
        UNKNOWN: '未知',
        MAN: '男',
        WOMAN: '女',
      };
      let gender = this.getDataValue('gender');
      return transform[gender];
    },
    set: function (gender) {
      if (gender === '男') {
        gender = 'MAN';
      } else if (gender === '女') {
        gender = 'WOMAN';
      } else {
        gender = 'UNKNOWN';
      }
      this.setDataValue('gender', gender);
    },
  },
  mobile: {
    type: Sequelize.STRING(20),
    allowNull: false,
    comment: '手机',
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '邮箱',
  },
  avatar: {
    type: Sequelize.TEXT,
    allowNull: false,
    comment: '头像',
  },
}, {
  createdAt: 'regist_at',
  updatedAt: 'login_at',
  underscored: true,
  freezeTableName: true,
  tableName: 'birthday_user',
});
