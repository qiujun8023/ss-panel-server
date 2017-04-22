'use strict';

const _ = require('lodash');
const config = require('config');

const cron = require('../lib/cron');
const wechat = require('../lib/wechat');
const birthday = require('../service/birthday');

// 判断是否当日有提醒
let getTodaySetting = function (birth) {
  for (let setting of birth.settings) {
    if (setting.advance === birth.countdown) {
      return setting;
    }
  }
  return false;
};

// 生成当前的提醒
let _today = function* () {
  let offset = 0;
  let limit = 20;

  // eslint-disable-next-line
  while (true) {
    let births = yield birthday.findBirthWithSettingAsync(offset, limit);
    if (_.isEmpty(births)) {
      break;
    }

    // 获取当日的提醒列表
    for (let birth of births) {
      let setting = getTodaySetting(birth);
      if (setting) {
        let setting_id = setting.setting_id;
        let time = setting.time;
        yield birthday.addRemindAsync(setting_id, {time});
      }
    }

    offset += limit;
  }
};

// 设置已提醒
let _setIsRemind = function* (remind_ids) {
  for (let remind_id of remind_ids) {
    yield birthday.updateRemindAsync(remind_id, {is_remind: true});
  }
};

// 发送图文消息
let _sendNewsMessage = function* (user_id, articles) {
  let to = {touser: user_id};
  let message = {
    msgtype: 'news',
    news: {articles},
  };
  yield wechat.sendAsync(to, message);
  yield birthday.addLogAsync(user_id, {content: JSON.stringify(message)});
  return true;
};

// 发送提醒给用户
let _remindUserAysnc = function* (need_remind) {
  for (let user_id in need_remind) {
    // 获取排序后的生日提醒列表
    let births = birthday.sortBirths(need_remind[user_id]);

    let articles = [];
    let remind_ids = [];
    let is_overflow = false;
    for (let i = 0; i < births.length; i++) {
      let birth = births[i];
      remind_ids.push(birth.remind_id);

      // 单个提醒
      if (births.length === 1) {
        let article = {
          title: '生日提醒',
          picurl: config.birthday.wechat.top_pic,
        };
        if (birth.countdown === 0) {
          article.description =
            `今天是 ${birth.title} 的 ${birth.age} 周岁 生日，不要忘了送上你的生日祝福哟。`;
        } else {
          article.description = `还有 ${birth.countdown} 天就是 ${birth.title} 的` +
                                `${birth.age + 1} 周岁生日了，记得做好准备并送上你的祝福哟。`;
        }
        articles.push(article);
        break;
      }

      // 多个提醒
      let title;
      if (birth.countdown === 0) {
        title = `今天是 ${birth.title}[${birth.age}周岁] 生日哟！`;
      } else {
        title = `距离 ${birth.title}[${birth.age + 1}周岁] 生日只有 ${birth.countdown} 天了`;
      }

      // 最多添加五条记录
      if (i < 5) {
        articles.push({title});
      } else {
        is_overflow = true;
      }
    }

    if (is_overflow) {
      articles.push({
        title: '点击查看全部',
      });
    }

    if (births.length !== 1) {
      articles.unshift({
        title: '少年，你记住小伙伴们的生日了吗',
        picurl: config.birthday.wechat.top_pic,
      });
    }

    if (yield _sendNewsMessage(user_id, articles)) {
      yield _setIsRemind(remind_ids);
    }
  }
};

// 获取当前提醒列表
let _now = function* () {
  let need_remind = {};
  let reminds = yield birthday.findNowRemindAsync();
  for (let remind of reminds) {
    let setting = remind.setting;
    let birth = yield birthday.getBirthAsync(setting.birth_id);

    // 异常数据直接标注已提醒
    if (birth.countdown !== setting.advance) {
      yield _setIsRemind(remind.remind_id);
      continue;
    }

    // 添加到待提醒列表
    if (!need_remind[birth.user_id]) {
      need_remind[birth.user_id] = [];
    }
    birth.remind_id = remind.remind_id;
    need_remind[birth.user_id].push(birth);
  }

  return yield _remindUserAysnc(need_remind);
};

// 每天添加到列表中
let today = cron('0 0 0 * * *', _today);

// 每分钟获取列表、推送消息
let now = cron('0 * * * * *', _now);

module.exports = {
  _today,
  _now,
  today,
  now,
};
