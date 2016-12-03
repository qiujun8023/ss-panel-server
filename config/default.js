'use strict';

const path = require('path');

const pkg = require('../../package');

let config = {
  protocol: 'http',
  host: '127.0.0.1',
  port: '8001',

  env: 'development',
  debug: true,

  swagger: {
    info: {
      version: pkg.version,
    },
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
    wechat: {
      host: '127.0.0.1',
      port: 6379,
      keyPrefix: 'shard:wechat:',
    },
    network: {
      host: '127.0.0.1',
      port: 6379,
      keyPrefix: 'shard:network:',
    },
  },

  mysql: {
    shard: {
      poolSize: 5,
      host: '127.0.0.1',
      user: 'shard',
      password: 'FhfLaS4uzv5qwnPh',
      database: 'shard',
    },
  },

  wechat: {
    tick: {
      corpid: 'wx4e2c2b771c467c9f',
      secret: 'k7TGD8xJLDU6-sPH3NwY0eTs2oBPyAINMdbSbGN80fuEt01UK0Z8dWzhm7crgkz7',
      apps: {
        shard: {
          agentid: 0,
          token: 'mRoQySqj2XBEORdnuOh9wei17',
          aeskey: '6mRfWp9o1dfXHnmRBCFmTlpM3IIY377wy2iDJJjx4lM',
        },
      },
    },
  },

  logger: {
    file: {
      filename: '/tmp/shard.log',
    },
  },

  network: {
    flow: {
      threshold: 2500000,
      Interface: 'eth0:',
    },
  },

  birthday: {
    wechat: {
      top_pic: 'https://cdn.qiujun.me/161129/105133.png!wechat',
    },
  },

  client_dir: path.join(__dirname, '../../client'),
};

module.exports = config;
