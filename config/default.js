'use strict';

const path = require('path');

const pkg = require('../../package');

let config = {
  protocol: 'http',
  host: '127.0.0.1',
  port: '8001',
  base_url: 'http://127.0.0.1:8001/',

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
    host: '127.0.0.1',
    port: 6379,
    keyPrefix: 'shard:',
  },

  mysql: {
    poolSize: 5,
    host: '127.0.0.1',
    user: 'shard',
    password: 'FhfLaS4uzv5qwnPh',
    database: 'shard',
    timezone: '+08:00',
  },

  wechat: {
    corpid: 'wx4e2c2b771c467c9f',
    secret: 'k7TGD8xJLDU6-sPH3NwY0eTs2oBPyAINMdbSbGN80fuEt01UK0Z8dWzhm7crgkz7',
    agentid: 0,
    token: 'mRoQySqj2XBEORdnuOh9wei17',
    aeskey: '6mRfWp9o1dfXHnmRBCFmTlpM3IIY377wy2iDJJjx4lM',
  },

  upyun: {
    bucket: 'bucket',
    operator: 'operator',
    password: 'password',
    endpoint: 'endpoint',
    base_url: 'https://example.com', // 请求地址
  },

  ss: {
    min_port: 50001,
    max_port: 50999,
    init_transfer_enable: 10737418240, // 10G 流量
    random_password_pool: '0123456789abcdefghijklmnopqrstuvwxyz', // 随机密码字符集
    transfer_log_save_days: 180,
  },

  logger: {
    file: {
      filename: '/tmp/shard.log',
    },
  },

  birthday: {
    wechat: {
      top_pic: 'https://cdn.qiujun.me/images/birthday/wx-bg.png!wechat',
    },
  },

  client_dir: path.join(__dirname, '../../client'),
};

module.exports = config;
