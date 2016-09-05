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
    network: {
      poolSize: 5,
      host: '127.0.0.1',
      user: 'shard',
      password: 'FhfLaS4uzv5qwnPh',
      database: 'shard',
    },
  },

  wechat: {
    tick: {
      corpid: 'wx1eedf3f9bb7f47b0',
      secret: 'fWOjVeC5lfjSezwAv8W6r2OT-s8ZlxGZyXsVaX4AexSG2VTgGhI-Dr66pSPoJnJW',
      apps: {
        system: {
          agentid: 0,
        },
        birthday: {
          agentid: 9,
          token: 'qbiWQA3OYSmpeXuhiJ',
          aeskey: 'zoCYCqo61fLUUycvgNPAU3f6nORUUIblvY9NpCQkXoJ',
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

  client_dir: path.join(__dirname, '../../client'),
};

module.exports = config;
