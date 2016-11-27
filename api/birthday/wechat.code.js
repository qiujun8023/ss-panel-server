'use strict';

const config = require('config');
const ko = require('express-ko');
const wechat = require('wechat-enterprise');

const birthday = require('../../service/birthday');

// 微信配置信息
let wechat_config = {
  corpId: config.wechat.tick.corpid,
  token: config.wechat.tick.apps.shard.token,
  encodingAESKey: config.wechat.tick.apps.shard.aeskey,
};

let router = module.exports = {};

let getRecent = function* (user_id) {
  let answer = [{
    picurl: 'http://oejwo825b.bkt.clouddn.com/161127/105133.png!wechat',
  }];

  let births = yield birthday.findBirthAsync(user_id);
  if (!births.length) {
    answer[0].title = '生日提醒';
    answer[0].description = '哟！少年，你居然还没记录过生日。';
  }

  let birth_today = 0;
  for (let i = 0; i < births.length; i++) {
    let title;
    let birth = births[i];
    if (birth.countdown === 0) {
      birth_today++;
      title = `今天是 ${birth.title}[${birth.age}周岁] 生日哟！`;
    } else {
      title = `距离 ${birth.title}[${birth.age + 1}周岁] 生日还有 ${birth.countdown} 天`;
    }

    // 最多添加五条记录
    if (i < 5) {
      answer.push({title});
    }
  }

  if (birth_today === 0) {
    answer[0].title = '今天还没有小伙伴过生日哟';
  } else {
    answer[0].title = `今天有 ${birth_today} 位小伙伴过生日呢`;
  }

  return answer;
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

router.post = router.get = wechat(wechat_config, ko(handler));
