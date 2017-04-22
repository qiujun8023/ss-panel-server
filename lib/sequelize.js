'use strict';

const config = require('config');
const Sequelize = require('sequelize');

let mysql = config.mysql;
module.exports = new Sequelize(mysql.database, mysql.user, mysql.password, {
  host: mysql.host,
  timezone: mysql.timezone,
  dialect: 'mysql',
  pool: {
    max: mysql.poolSize,
    min: 0,
    idle: 10000,
  },
  logging: false,
});
