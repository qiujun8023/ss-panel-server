'use strict';

let config = require('config');
let wechat = require('wechat-enterprise');

// 微信配置信息
let wechat_config = {
  corpId: config.wechat.tick.corpid,
  token: config.wechat.tick.apps.birthday.token,
  encodingAESKey: config.wechat.tick.apps.birthday.aeskey,
};

let router = module.exports = {};

let handler = function (req, res) {
  res.reply('hello world');
};

router.post = router.get = wechat(wechat_config, handler);
