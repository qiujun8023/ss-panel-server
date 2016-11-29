'use strict';

const Sequelize = require('sequelize');

const sequelize = require('../../lib/sequelize')('shard');

module.exports = sequelize.define('network_remind', {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    comment: '用户 id',
  },
}, {
  updatedAt: false,
  underscored: true,
  freezeTableName: true,
});
