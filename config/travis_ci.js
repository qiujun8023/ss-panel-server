'use strict';

let config = {
  env: 'test',
  debug: false,

  redis: {
    host: 'localhost',
    port: 6379,
    keyPrefix: 'shard:',
  },

  mysql: {
    poolSize: 5,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shard',
    timezone: '+08:00',
  },

  upyun: {
    bucket: process.env.UPYUN_BUCKET,
    operator: process.env.UPYUN_OPERATOR,
    password: process.env.UPYUN_PASSWORD,
    endpoint: 'v0.api.upyun.com',
    base_url: 'https://example.com',
  },
};

module.exports = config;
