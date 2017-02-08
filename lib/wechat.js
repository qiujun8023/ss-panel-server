'use strict';

const co = require('co');
const config = require('config');
const Promise = require('bluebird');
const API = require('wechat-enterprise-api');

const redis = require('../lib/redis')('wechat');

let get_token = function (wechat_name) {
  return function (callback) {
    co(function* () {
      let key = `${wechat_name}:access_token`;
      return yield redis.get(key);
    }).then(function (token) {
      callback(null, JSON.parse(token));
    }).catch(callback);
  };
};

let set_token = function (wechat_name) {
  return function (token, callback) {
    co(function* () {
      let key = `${wechat_name}:access_token`;
      let time = token.expiresIn - 600;
      let data = JSON.stringify(token);
      yield redis.setex(key, time, data);
    }).then(function () {
      callback(null);
    }).catch(callback);
  };
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

let connections = {};
for (let wechat_name in config.wechat) {
  let wechat = config.wechat[wechat_name];
  connections[wechat_name] = {};
  for (let app_name in wechat.apps) {
    let app = wechat.apps[app_name];
    let api = new API(
      wechat.corpid,
      wechat.secret,
      app.agentid,
      get_token(wechat_name),
      set_token(wechat_name)
    );

    connections[wechat_name][app_name] = adjust(api);
  }
}

module.exports = function getWechat(wechat_name, app_name) {
  return connections[wechat_name][app_name];
};
