'use strict';

const config = require('config');
const Redis = require('ioredis');

module.exports = new Redis(config.redis);
