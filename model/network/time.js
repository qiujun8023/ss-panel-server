'use strict';

const Sequelize = require('sequelize');

const sequelize = require('../../lib/sequelize')('network');

module.exports = sequelize.define('network_time', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '自增 id',
  },
  time: {
    type: Sequelize.INTEGER,
    allowNull: false,
    comment: '耗时，单位 ms',
  },
}, {
  updatedAt: false,
  underscored: true,
  freezeTableName: true,
});
