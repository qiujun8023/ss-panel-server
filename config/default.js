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
      corpid: 'wechat corpid',
      secret: 'wechat secret',
      apps: {
        shard: {
          agentid: 0,
          token: 'shard app token',
          aeskey: 'shard app aeskey',
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
