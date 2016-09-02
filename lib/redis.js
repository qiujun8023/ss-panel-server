'use strict';

const config = require('config');
const Redis = require('ioredis');

let connections = {};
Object.keys(config.redis).forEach((name) => {
  connections[name] = new Redis(config.redis[name]);
});
module.exports = function getRedis(name) {
  return connections[name];
};
