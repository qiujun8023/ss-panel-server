'use strict';

const path = require('path');

const pkg = require('../../package');

let host = '127.0.0.1';
let port = '8001';
let protocol = 'http';

let config = {
  protocol: protocol,
  host: host,
  port: port,

  env: 'development',
  debug: true,

  swagger: {
    info: {
      version: pkg.version,
    },
    host: `${host}:${port}`,
  },

  session: {
    secret: 'shard_secret',
    name: 'session',
  },

  redis: {
    session: {
      host: '127.0.0.1',
      port: 6379,
      keyPrefix: 'shard:session:',
    },
  },

  mysql: {
    network: {
      poolSize: 5,
      host: '127.0.0.1',
      user: 'shard',
      password: 'FhfLaS4uzv5qwnPh',
      database: 'shard',
    },
  },

  logger: {
    file: {
      filename: '/tmp/shard.log',
    },
  },

  client_dir: path.join(__dirname, '../../client'),
};

module.exports = config;
