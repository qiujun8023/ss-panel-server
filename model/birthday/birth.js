'use strict';

const Sequelize = require('sequelize');

const sequelize = require('../../lib/sequelize')('shard');

module.exports = sequelize.define('birthday_birth', {
  birth_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: '生日 Id',
  },
  user_id: {
    type: Sequelize.STRING(30),
    allowNull: false,
    comment: '用户 Id',
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '姓名/标题',
  },
  type: {
    type: Sequelize.ENUM,
    values: ['SOLAR', 'LUNAR'],
    allowNull: false,
    comment: '阳历/阴历',
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false,
    comment: '日期',
  },
  age: {
    type: Sequelize.INTEGER(2),
    allowNull: false,
    comment: '年龄',
  },
  zodiac: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '生肖',
  },
  constellation: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '星座',
  },
}, {
  underscored: true,
  freezeTableName: true,
});
