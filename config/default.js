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
    name: 'session'
  },

  redis: {
    session: {
      host: '127.0.0.1',
      port: 6379,
      keyPrefix: 'shard:session:',
    },
  },

  logger: {
    file: {
      filename: '/tmp/shard.log',
    }
  },

  client_dir: path.join(__dirname, '../../client')
};

module.exports = config;
