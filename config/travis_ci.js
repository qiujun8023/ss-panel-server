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
};

module.exports = config;
