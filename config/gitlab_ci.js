'use strict';

let config = {
  env: 'test',
  debug: false,

  redis: {
    session: {
      host: 'redis',
      port: 6379,
      keyPrefix: 'shard:session:',
    },
    wechat: {
      host: 'redis',
      port: 6379,
      keyPrefix: 'shard:wechat:',
    },
  },

  mysql: {
    shard: {
      poolSize: 5,
      host: 'mysql',
      user: 'root',
      password: 'FhfLaS4uzv5qwnPh',
      database: 'shard',
    },
  },
};

module.exports = config;
