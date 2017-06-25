'use strict'

const Sequelize = require('sequelize')

const sequelize = require('../lib/sequelize')

module.exports = sequelize.define('offer', {
  offerId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: '节点 Id'
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '节点名称'
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '宣传网址'
  },
  sort: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '排序'
  }
}, {
  freezeTableName: true
})
