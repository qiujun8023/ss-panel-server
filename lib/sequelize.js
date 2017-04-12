'use strict';

const config = require('config');
const Sequelize = require('sequelize');

let connections = {};
Object.keys(config.mysql).forEach((name) => {
  let mysql = config.mysql[name];
  connections[name] = new Sequelize(mysql.database, mysql.user, mysql.password, {
    host: mysql.host,
    timezone: mysql.timezone || '+08:00',
    dialect: 'mysql',
    pool: {
      max: mysql.poolSize,
      min: 0,
      idle: 10000,
    },
    logging: false,
  });
});

module.exports = function getMysql(name) {
  return connections[name];
};
