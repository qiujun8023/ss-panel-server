'use strict';

const Sequelize = require('sequelize');

const sequelize = require('../../lib/sequelize')('shard');

module.exports = sequelize.define('network_speed', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '自增 id',
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
