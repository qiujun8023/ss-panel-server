'use strict';

const path = require('path');

let host = '127.0.0.1';
let port = '8003';

let config = {
  protocol: 'http',
  host: host,
  port: port,

  env: 'development',
  debug: true,

  session: {
    secret: 'shard_secret',
    name: 'session'
  },

  session_store: {
    prefix: 'shard:session:'
  },

  redis: {
    host: '127.0.0.1',
    port: 6379,
  },

  logger: {
    file: {
      filename: '/tmp/shard.log',
    }
  },

  client_dir: path.join(__dirname, '../../client')
};

module.exports = config;
