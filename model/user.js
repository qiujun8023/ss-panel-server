'use strict'

const Sequelize = require('sequelize')

const sequelize = require('../lib/sequelize')

module.exports = sequelize.define('user', {
  userId: {
    type: Sequelize.STRING(32),
    allowNull: false,
    primaryKey: true,
    comment: '用户 Id'
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '姓名'
  },
  port: {
    type: Sequelize.INTEGER,
    unique: true,
    allowNull: false,
    comment: 'SS 端口'
  },
  password: {
    type: Sequelize.STRING(32),
    allowNull: false,
    comment: 'SS 密码'
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
  transferEnable: {
    type: Sequelize.BIGINT,
    allowNull: false,
    comment: '总流量'
  },
  isAdmin: {
    type: Sequelize.ENUM,
    values: ['Y', 'N'],
    defaultValue: 'N',
    allowNull: false,
    comment: '是否管理员',
    get: function () {
      let isAdmin = this.getDataValue('isAdmin')
      return isAdmin === 'Y'
    },
    set: function (isAdmin) {
      this.setDataValue('isAdmin', isAdmin ? 'Y' : 'N')
    }
  },
  isLocked: {
    type: Sequelize.ENUM,
    values: ['Y', 'N'],
    defaultValue: 'N',
    allowNull: false,
    comment: '是否禁用',
    get: function () {
      let isLocked = this.getDataValue('isLocked')
      return isLocked === 'Y'
    },
    set: function (isLocked) {
      this.setDataValue('isLocked', isLocked ? 'Y' : 'N')
    }
  },
  activeAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
    comment: '活跃时间'
  }
}, {
  createdAt: 'registAt',
  updatedAt: false,
  freezeTableName: true
})
