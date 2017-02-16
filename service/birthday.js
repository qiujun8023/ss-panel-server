'use strict';

const _ = require('lodash');
const co = require('co');
const moment = require('moment');
const solarLunar = require('solarlunar');
const constellation = require('node-constellation');

const birthdayModel = require('../model/birthday');
const sequelize = require('../lib/sequelize')('shard');

const UserModel = birthdayModel.User;
const BirthModel = birthdayModel.Birth;
const SettingModel = birthdayModel.Setting;
const RemindModel = birthdayModel.Remind;

let birthday = module.exports = {};

// 生日排序
birthday.sortBirths = function (births) {
  births.sort(function (a, b) {
    if (a.countdown !== b.countdown) {
      return a.countdown - b.countdown;
    }
    return a.age - b.age;
  });

  return births;
};

// 日期大小比较
birthday.dateCompare = function (today, birth, type) {
  if (type === 'SOLAR') {
    today = today.cMonth * 100 + today.cDay;
    birth = birth.cMonth * 100 + birth.cDay;
  } else {
    today = today.lMonth * 100 + today.lDay;
    birth = birth.lMonth * 100 + birth.lDay;
  }

  return (today === birth) ? 0 :
    (today < birth) ? -1 : 1;
};

// 计算年龄
birthday.getAge = function (today, birth, type) {
  let compare = this.dateCompare(today, birth, type);

  // 计算年龄
  let age;
  if (type === 'SOLAR') {
    age = today.cYear - birth.cYear;
  } else {
    age = today.lYear - birth.lYear;
  }

  // 今年未过生日，减去
  if (compare === -1) {
    return age - 1;
  }

  return age;
};

// 计算倒计时
birthday.getCountdown = function (today, birth, type) {
  let next_birthday;
  let compare = this.dateCompare(today, birth, type);

  if (type === 'SOLAR') {
    next_birthday = [today.cYear, birth.cMonth, birth.cDay];
    if (compare === 1) {
      next_birthday[0]++;
    }
  } else {
    let tmp_date = [today.lYear, birth.lMonth, birth.lDay];
    if (compare === 1) {
      tmp_date[0]++;
    }
    let tmp_data = solarLunar.lunar2solar.apply(this, tmp_date);
    next_birthday = [tmp_data.cYear, tmp_data.cMonth, tmp_data.cDay];
  }

  // nodejs 月份从 0 开始
  next_birthday[1]--;

  // 计算日期差
  let tmp = moment([today.cYear, today.cMonth - 1, today.cDay]);
  return moment(next_birthday).diff(tmp, 'days');
};

// 格式化生日
birthday.formartBirth = function (birth) {
  let now = moment();
  let now_date = [now.year(), now.month() + 1, now.date()];
  let today = solarLunar.solar2lunar.apply(this, now_date);

  // 获取出生时的阳历与阴历
  let data;
  let birth_date = _.split(birth.date, '-').map(_.toInteger);
  if (birth.type === 'SOLAR') {
    data = solarLunar.solar2lunar.apply(this, birth_date);
    birth.date_formart = `${birth_date[1]}月${birth_date[2]}日`;
  } else {
    data = solarLunar.lunar2solar.apply(this, birth_date);
    birth.date_formart = data.monthCn + data.dayCn;
  }

  // 设置属性/年龄/倒计时/星座
  birth.zodiac = data.animal;
  birth.age = this.getAge(today, data, birth.type);
  birth.countdown = this.getCountdown(today, data, birth.type);
  birth.constellation = constellation(data.cMonth, data.cDay, 'zh-cn');

  return birth;
};

// 添加或更新用户
birthday.addOrUpdateUserAsync = function* (data) {
  yield UserModel.upsert(data, {
    fields: ['user_id', 'name', 'gender', 'mobile', 'email', 'avatar'],
  });
  return yield this.getUserAsync(data.user_id);
};

// 获取用户
birthday.getUserAsync = function* (user_id) {
  let user = yield UserModel.findById(user_id);
  if (!user) {
    return false;
  }

  return user.get({plain: true});
};

// 删除用户
birthday.removeUserAsync = function* () {
  return true;
};

// 添加生日
birthday.addBirthAsync = function* (user_id, data) {
  let user = yield UserModel.findById(user_id);
  if (!user) {
    return false;
  }

  let birth = yield user.createBirth(data, {
    fields: ['title', 'type', 'date'],
  });
  return this.formartBirth(birth.get({plain: true}));
};

// 查询生日
birthday.getBirthAsync = function* (birth_id) {
  let birth = yield BirthModel.findById(birth_id);
  if (!birth) {
    return false;
  }

  birth = birth.get({plain: true});
  return this.formartBirth(birth);
};

// 获取生日
birthday.findBirthAsync = function* (user_id) {
  let births = yield BirthModel.findAll({
    where: {user_id},
  });

  let res = [];
  for (let birth of births) {
    birth = birth.get({plain: true});
    res.push(this.formartBirth(birth));
  }

  return this.sortBirths(res);
};

// 更新生日
birthday.updateBirthAsync = function* (birth_id, data) {
  let birth = yield BirthModel.findById(birth_id);
  if (!birth) {
    return false;
  }

  birth = yield birth.update(data, {
    fields: ['title', 'type', 'date'],
  });
  birth = birth.get({plain: true});
  return this.formartBirth(birth);
};

// 删除生日
birthday.removeBirthAsync = function* (birth_id) {
  let birth = yield BirthModel.findById(birth_id);
  if (!birth) {
    return false;
  }

  return yield sequelize.transaction(function (t) {
    return co(function* () {
      let settings = yield birth.getSettings();
      for (let setting of settings) {
        // 删除提醒
        yield RemindModel.destroy({
          where: {setting_id: setting.setting_id},
          transaction: t,
        });
        // 删除设置
        yield setting.destroy({transaction: t});
      }
      // 删除生日
      return birth.destroy({transaction: t});
    });
  });
};

// 查询设置/生日
birthday.findBirthWithSettingAsync = function* (offset, limit) {
  let births = yield BirthModel.findAll({
    include: [ SettingModel ],
    offset,
    limit,
  });

  let res = [];
  for (let birth of births) {
    birth = birth.get({plain: true});
    res.push(this.formartBirth(birth));
  }

  return res;
};

// 添加设置
birthday.addSettingAsync = function* (birth_id, data) {
  let birth = yield BirthModel.findById(birth_id);
  if (!birth) {
    return false;
  }

  data = _.pick(data, ['advance', 'time']);
  let setting = yield birth.createSetting(data);
  return setting.get({plain: true});
};

// 获取设置
birthday.getSettingAsync = function* (setting_id) {
  let setting = yield SettingModel.findById(setting_id);
  if (!setting) {
    return false;
  }

  return setting.get({plain: true});
};

// 查询设置
birthday.findSettingAsync = function* (birth_id) {
  let settings = yield SettingModel.findAll({
    where: {birth_id},
  });

  let res = [];
  for (let setting of settings) {
    setting = setting.get({plain: true});
    res.push(setting);
  }

  return res;
};

// 删除设置
birthday.removeSettingAsync = function* (setting_id) {
  let setting = yield SettingModel.findById(setting_id);
  if (!setting) {
    return false;
  }

  return yield sequelize.transaction(function (t) {
    // 删除提醒
    return RemindModel.destroy({
      where: {setting_id: setting.setting_id},
      transaction: t,
    }).then(function () {
      // 删除设置
      return setting.destroy({transaction: t});
    });
  });
};

// 添加提醒
birthday.addRemindAsync = function* (setting_id, data) {
  let setting = yield SettingModel.findById(setting_id);
  if (!setting) {
    return false;
  }

  data = _.pick(data, ['time']);
  let remind = yield setting.createRemind(data);
  return remind.get({plain: true});
};

// 获取未完成提醒
birthday.findNowRemindAsync = function* () {
  let reminds = yield RemindModel.findAll({
    include: [{
      model: SettingModel,
      where: {
        time: {
          $lte: moment().format('HH:mm:ss'),
        },
      },
    }],
    where: {
      is_remind: 'N',
      created_at: {
        $gte: moment().subtract(1, 'day').toDate(),
      },
    },
  });

  let res = [];
  for (let remind of reminds) {
    remind = remind.get({plain: true});
    res.push(remind);
  }
  return res;
};

// 更新提醒
birthday.updateRemindAsync = function* (remind_id, data) {
  let remind = yield RemindModel.findById(remind_id);
  if (!remind) {
    return false;
  }

  data = _.pick(data, ['is_remind']);
  remind = yield remind.update(data);
  return remind.get({plain: true});
};

// 添加日志
birthday.addLogAsync = function* (user_id, data) {
  let user = yield UserModel.findById(user_id);
  if (!user) {
    return false;
  }

  data = _.pick(data, ['content']);
  let log = yield user.createLog(data);
  return log.get({plain: true});
};
