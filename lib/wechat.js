'use strict';

const config = require('config');
const Promise = require('bluebird');
const API = require('wechat-enterprise-api');

const redis = require('../lib/redis');

const TOKEN_CACHE_KEY = 'wechat:access_token';

let getToken = function (callback) {
  redis.get(TOKEN_CACHE_KEY, function (err, result) {
    callback(err, JSON.parse(result));
  });
};

let setToken = function (token, callback) {
  let time = token.expiresIn - 600;
  let data = JSON.stringify(token);
  redis.setex(TOKEN_CACHE_KEY, time, data, callback);
};

let adjust = function (api) {
  // 防止非线上环境发消息
  let send = api.send;
  api.send = function (to, message, callback) {
    if (config.env !== 'production') {
      return callback(null, {
        errcode: 0,
        errmsg: 'ok',
      });
    }
    return send.call(api, to, message, callback);
  };

  return Promise.promisifyAll(api);
};

let corpid = config.wechat.corpid;
let secret = config.wechat.secret;
let agentid = config.wechat.agentid;
let api = new API(corpid, secret, agentid, getToken, setToken);
let wechat = module.exports = adjust(api);

wechat._getToken = getToken;
wechat._setToken = setToken;
