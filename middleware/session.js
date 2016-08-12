'use strict';

const _ = require('lodash');
const config = require('config');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const redis_client = require('../lib/redis');

// 创建 Session 存储实例
let default_store_options = {
  client: redis_client
};
let store_options = _.assign(default_store_options, config.session_store);
let session_store = new RedisStore(store_options);

let default_options = {
  secret: 'cookie_secret',
  name: 'session',
  store: session_store,
  proxy: true,
  resave: true,
  saveUninitialized: true,
};
let options = _.assign(default_options, config.session);
module.exports = session(options);
