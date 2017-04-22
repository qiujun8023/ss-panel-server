'use strict';

const Sequelize = require('sequelize');

const sequelize = require('../../lib/sequelize');

module.exports = sequelize.define('user', {
  user_id: {
    type: Sequelize.STRING(32),
    allowNull: false,
    primaryKey: true,
    comment: '用户 Id',
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '姓名',
  },
  port: {
    type: Sequelize.INTEGER,
    unique: true,
    allowNull: false,
    comment: 'SS 端口',
  },
  password: {
    type: Sequelize.STRING(32),
    allowNull: false,
    comment: 'SS 密码',
  },
  flow_up: {
    type: Sequelize.BIGINT,
    allowNull: false,
    defaultValue: 0,
    comment: '上传流量',
  },
  flow_down: {
    type: Sequelize.BIGINT,
    allowNull: false,
    defaultValue: 0,
    comment: '下载流量',
  },
  transfer_enable: {
    type: Sequelize.BIGINT,
    allowNull: false,
    comment: '总流量',
  },
  is_admin: {
    type: Sequelize.ENUM,
    values: ['Y', 'N'],
    defaultValue: 'N',
    allowNull: false,
    comment: '是否管理员',
    get: function () {
      let is_admin = this.getDataValue('is_admin');
      return is_admin === 'Y';
    },
    set: function (is_admin) {
      this.setDataValue('is_admin', is_admin ? 'Y' : 'N');
    },
  },
  is_locked: {
    type: Sequelize.ENUM,
    values: ['Y', 'N'],
    defaultValue: 'N',
    allowNull: false,
    comment: '是否禁用',
    get: function () {
      let is_locked = this.getDataValue('is_locked');
      return is_locked === 'Y';
    },
    set: function (is_locked) {
      this.setDataValue('is_locked', is_locked ? 'Y' : 'N');
    },
  },
  active_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
    comment: '活跃时间',
  },
}, {
  createdAt: 'regist_at',
  updatedAt: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'ss_user',
});
