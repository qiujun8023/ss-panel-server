'use strict';

const config = require('config');
const ko = require('express-ko');
const wechat = require('wechat-enterprise');

const birthday = require('../../service/birthday');

// 微信配置信息
let wechat_config = {
  corpId: config.wechat.corpid,
  token: config.wechat.token,
  encodingAESKey: config.wechat.aeskey,
};

let router = module.exports = {};

let getRecent = function* (user_id) {
  let articles = [{
    picurl: config.birthday.wechat.top_pic,
  }];

  let births = yield birthday.findBirthAsync(user_id);
  if (!births.length) {
    Object.assign(articles[0], {
      title: '生日提醒',
      description: '哟！少年，你居然还没记录过生日。',
      url: `${config.base_url}birthday/add`,
    });
    return articles;
  }

  let birth_today = 0;
  for (let i = 0; i < births.length; i++) {
    let title;
    let birth = births[i];
    if (birth.countdown === 0) {
      birth_today++;
      title = `今天是 ${birth.title}[${birth.age}周岁] 生日哟！`;
    } else {
      title = `距离 ${birth.title}[${birth.age + 1}周岁] 生日只有 ${birth.countdown} 天了`;
    }

    // 最多添加五条记录
    if (i < 5) {
      articles.push({title, url: `${config.base_url}birthday/${birth.birth_id}`});
    }
  }

  if (birth_today === 0) {
    articles[0].title = '今天还没有小伙伴过生日哟';
  } else {
    articles[0].title = `今天有 ${birth_today} 位小伙伴过生日呢`;
  }

  return articles;
};

// 微信点击事件消息处理
let clickEventHander = function* (req) {
  switch (req.EventKey) {
    case 'recent':
      return yield getRecent(req.FromUserName);
  }
};

// 微信事件消息处理
let eventHandler = function* (req) {
  switch (req.Event) {
    case 'click':
      return yield clickEventHander(req);
  }
};

// 微信消息处理
let handler = function* (req, res) {
  let answer;
  switch (req.weixin.MsgType) {
    case 'event':
      answer = yield eventHandler(req.weixin);
      break;
  }

  res.reply(answer);
};

router.post = router.get = function* (req, res, next) {
  if (req.isSwitchOn('wechat')) {
    req.weixin = req.body;
    // 防止返回值检查
    res.reply = function (data) {
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(data));
    };
    yield handler(req, res);
    return;
  }
  wechat(wechat_config, ko(handler))(req, res, next);
};
