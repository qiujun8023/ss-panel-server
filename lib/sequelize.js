'use strict';

const config = require('config');
const Sequelize = require('sequelize');

let connections = {};
Object.keys(config.mysql).forEach((name) => {
  let op = config.mysql[name];
  connections[name] = new Sequelize(op.database, op.user, op.password, {
    host: op.host,
    dialect: 'mysql',
    pool: {
      max: op.poolSize,
      min: 0,
      idle: 10000,
    },
  });
  connections[name].options.logging = function () {};
});

module.exports = function getMysql(name) {
  return connections[name];
};
