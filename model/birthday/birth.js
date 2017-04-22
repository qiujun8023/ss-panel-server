'use strict';

const moment = require('moment');
const Sequelize = require('sequelize');

const sequelize = require('../../lib/sequelize');

module.exports = sequelize.define('birth', {
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
    get: function () {
      let date = this.getDataValue('date');
      return moment(date).format('YYYY-MM-DD');
    },
  },
}, {
  underscored: true,
  freezeTableName: true,
  tableName: 'birthday_birth',
});
