'use strict';

let config = {
  env: 'test',
  debug: false,

  redis: {
    session: {
      host: 'localhost',
      port: 6379,
      keyPrefix: 'shard:session:',
    },
    wechat: {
      host: 'localhost',
      port: 6379,
      keyPrefix: 'shard:wechat:',
    },
  },

  mysql: {
    shard: {
      poolSize: 5,
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'shard',
    },
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
