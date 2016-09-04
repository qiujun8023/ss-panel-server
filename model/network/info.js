'use strict';

const Sequelize = require('sequelize');

const sequelize = require('../../lib/sequelize')('network');

module.exports = sequelize.define('network_info', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '自增 id',
  },
  client_ip: {
    type: Sequelize.STRING(15),
    allowNull: false,
    comment: '访问者 ip',
  },
  size: {
    type: Sequelize.BIGINT,
    allowNull: false,
    comment: '大小，单位 bytes',
  },
  time_elapsed: {
    type: Sequelize.INTEGER,
    allowNull: false,
    comment: '耗时，单位 ms',
  },
  speed: {
    type: Sequelize.BIGINT,
    allowNull: false,
    comment: '速度，单位 bps',
  },
}, {
  updatedAt: false,
  underscored: true,
  freezeTableName: true,
});
