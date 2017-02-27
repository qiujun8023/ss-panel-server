'use strict';

const moment = require('moment');
const solarLunar = require('solarlunar');
const expect = require('chai').expect;

const birthday = require('./birthday');
const utility = require('../lib/test/utility');
const random = require('../lib/test/random');

describe('server/service/birthday', function () {
  let now = moment();
  let now_date = [now.year(), now.month() + 1, now.date()];
  let today = solarLunar.solar2lunar.apply(this, now_date);
  let user;
  let birth;
  let setting;
  let remind;

  describe('sortBirths', function () {
    it('should sort birth success', function () {
      let births = birthday.sortBirths([
        {
          birth_id: 1,
          countdown: 20,
          age: 5,
        }, {
          birth_id: 2,
          countdown: 20,
          age: 6,
        }, {
          birth_id: 3,
          countdown: 18,
          age: 5,
        },
      ]);
      expect(births[0].birth_id).to.equal(3);
      expect(births[2].birth_id).to.equal(2);
    });
  });

  describe('dateCompare', function () {
    it('should return -1 if compare today and yesterday', function () {
      let yesterday = moment().subtract(1, 'days');
      yesterday = [yesterday.year(), yesterday.month() + 1, yesterday.date()];
      yesterday = solarLunar.solar2lunar.apply(this, yesterday);
      let res1 = birthday.dateCompare(today, yesterday, 'SOLAR');
      let res2 = birthday.dateCompare(today, yesterday, 'LUNAR');
      expect(res1).to.equal(1);
      expect(res2).to.equal(1);
    });

    it('should return 0 if compare today and today', function () {
      let res1 = birthday.dateCompare(today, today, 'SOLAR');
      let res2 = birthday.dateCompare(today, today, 'LUNAR');
      expect(res1).to.equal(0);
      expect(res2).to.equal(0);
    });

    it('should return -1 if compare today and tomorrow', function () {
      let tomorrow = moment().add(1, 'days');
      tomorrow = [tomorrow.year(), tomorrow.month() + 1, tomorrow.date()];
      tomorrow = solarLunar.solar2lunar.apply(this, tomorrow);
      let res1 = birthday.dateCompare(today, tomorrow, 'SOLAR');
      let res2 = birthday.dateCompare(today, tomorrow, 'LUNAR');
      expect(res1).to.equal(-1);
      expect(res2).to.equal(-1);
    });
  });

  describe('getAge', function () {
    it('should return 1', function () {
      let last_year = moment().subtract(1, 'year');
      last_year = [last_year.year(), last_year.month() + 1, last_year.date()];
      last_year = solarLunar.solar2lunar.apply(this, last_year);
      let res1 = birthday.getAge(today, last_year, 'SOLAR');
      expect(res1).to.equal(1);
      last_year = [today.lYear - 1, today.lMonth, today.lDay];
      last_year = solarLunar.lunar2solar.apply(this, last_year);
      let res2 = birthday.getAge(today, last_year, 'LUNAR');
      expect(res2).to.equal(1);
    });

    it('should return 0', function () {
      let last_year = moment().subtract(1, 'year').add(1, 'days');
      last_year = [last_year.year(), last_year.month() + 1, last_year.date()];
      last_year = solarLunar.solar2lunar.apply(this, last_year);
      let res1 = birthday.getAge(today, last_year, 'SOLAR');
      expect(res1).to.equal(0);
    });
  });

  describe('getCountdown', function () {
    it('should return 1', function () {
      let tomorrow = moment().add(1, 'days');
      tomorrow = [tomorrow.year(), tomorrow.month() + 1, tomorrow.date()];
      tomorrow = solarLunar.solar2lunar.apply(this, tomorrow);
      let res1 = birthday.getCountdown(today, tomorrow, 'SOLAR');
      expect(res1).to.equal(1);
    });

    it('should return the length of this year', function () {
      let yesterday = moment().subtract(1, 'days');
      yesterday = [yesterday.year(), yesterday.month() + 1, yesterday.date()];
      yesterday = solarLunar.solar2lunar.apply(this, yesterday);
      let res1 = birthday.getCountdown(today, yesterday, 'SOLAR');
      let res2 = birthday.getCountdown(today, yesterday, 'LUNAR');
      let tmp_data = [yesterday.lYear + 1, yesterday.lMonth, yesterday.lDay];
      tmp_data = solarLunar.lunar2solar.apply(this, tmp_data);
      tmp_data = moment([tmp_data.cYear, tmp_data.cMonth - 1, tmp_data.cDay]);
      expect(res1).to.equal(now.isLeapYear() ? 365 : 364);
      expect(res2).to.equal(tmp_data.diff(today, 'days'));
    });
  });

  describe('formatBirth', function () {
    it('should format birth success', function () {
      let date = `${now.year - 1}-${now.month}-${now.day}`;
      let birth1 = birthday.formatBirth({
        birth_id: 1,
        title: 'test',
        type: 'SOLAR',
        date,
      });
      let birth2 = birthday.formatBirth({
        birth_id: 1,
        title: 'test',
        type: 'LUNAR',
        date,
      });
      let keys = ['year', 'month', 'day', 'zodiac', 'age', 'countdown', 'constellation', 'days'];
      expect(birth1).to.include.keys(keys);
      expect(birth2).to.include.keys(keys);
    });
  });

  describe('addOrUpdateUserAsync', function () {
    it('should add user success', function* () {
      user = yield utility.birthday.createTestUserAsync();
      expect(user).to.include.keys(['user_id', 'name', 'gender', 'mobile', 'email', 'avatar']);
    });
  });

  describe('getUserAsync', function () {
    it('should return false if user not found', function* () {
      let tmp_user = yield birthday.getUserAsync('invalid user');
      expect(tmp_user).to.be.false;
    });

    it('should get user success', function* () {
      let tmp_user = yield birthday.getUserAsync(user.user_id);
      expect(tmp_user.name).to.equal(user.name);
    });
  });

  describe('addBirthAsync', function () {
    it('should return false if user not found', function* () {
      let tmp_birth = yield utility.birthday.createTestBirthAsync('invalid user');
      expect(tmp_birth).to.be.false;
    });

    it('should add birth success', function* () {
      birth = yield utility.birthday.createTestBirthAsync(user.user_id);
      expect(birth).to.include.keys(['birth_id', 'title', 'type', 'date']);
    });
  });

  describe('getBirthAsync', function () {
    it('should return false if birth not found', function* () {
      let tmp_birth = yield birthday.getBirthAsync(-1);
      expect(tmp_birth).to.be.false;
    });

    it('should get birth success', function* () {
      let tmp_birth = yield birthday.getBirthAsync(birth.birth_id);
      expect(tmp_birth.title).to.equal(birth.title);
      expect(tmp_birth.type).to.equal(birth.type);
      expect(tmp_birth.date).to.equal(birth.date);
    });
  });

  describe('findBirthAsync', function () {
    it('should return birth list success', function* () {
      let births = yield birthday.findBirthAsync(user.user_id);
      expect(births.length).to.equal(1);
      expect(births[0].birth_id).to.equal(birth.birth_id);
    });
  });

  describe('updateBirthAsync', function () {
    it('should return false if birth not found', function* () {
      let tmp_birth = yield birthday.updateBirthAsync(-1);
      expect(tmp_birth).to.be.false;
    });

    it('should update birth success', function* () {
      let title = random.birthday.getBirthTitle();
      let tmp_birth = yield birthday.updateBirthAsync(birth.birth_id, {title});
      expect(tmp_birth.title).to.equal(title);
      birth.title = title;
    });
  });

  describe('findBirthWithSettingAsync', function () {
    it('should return list success', function* () {
      let births = yield birthday.findBirthWithSettingAsync(0, 1);
      expect(births.length).to.equal(1);
      expect(births[0]).to.include.keys('settings');
    });
  });

  describe('addSettingAsync', function () {
    it('should return false if birth not found', function* () {
      let tmp_birth = yield birthday.addSettingAsync(-1);
      expect(tmp_birth).to.be.false;
    });

    it('should add setting success', function* () {
      let advance = random.birthday.getSettingAdvance();
      let time = random.birthday.getSettingTime();
      setting = yield birthday.addSettingAsync(birth.birth_id, {advance, time});
      expect(setting).to.include.keys(['setting_id', 'advance', 'time']);
    });
  });

  describe('getSettingAsync', function () {
    it('should return false if setting not found', function* () {
      let tmp_setting = yield birthday.getSettingAsync(-1);
      expect(tmp_setting).to.be.false;
    });

    it('should get setting success', function* () {
      let tmp_setting = yield birthday.getSettingAsync(setting.setting_id);
      expect(tmp_setting.setting_id).to.equal(setting.setting_id);
      expect(tmp_setting.advance).to.equal(setting.advance);
      expect(tmp_setting.time).to.equal(setting.time);
    });
  });

  describe('findSettingAsync', function () {
    it('should return setting list success', function* () {
      let settings = yield birthday.findSettingAsync(birth.birth_id);
      expect(settings.length).to.equal(1);
      expect(settings[0].setting_id).to.equal(setting.setting_id);
    });
  });

  describe('updateSettingAsync', function () {
    it('should return false if setting not found', function* () {
      let tmp_setting = yield birthday.updateSettingAsync(-1);
      expect(tmp_setting).to.be.false;
    });

    it('should update setting success', function* () {
      let advance = random.birthday.getSettingAdvance();
      let time = '00:00';
      let tmp_setting = yield birthday.updateSettingAsync(setting.setting_id, {advance, time});
      expect(tmp_setting.advance).to.equal(advance);
      expect(tmp_setting.time).to.equal(time);
      setting.advance = advance;
      setting.time = time;
    });
  });

  describe('addRemindAsync', function () {
    it('should return false if setting not found', function* () {
      let tmp_setting = yield birthday.addRemindAsync(-1);
      expect(tmp_setting).to.be.false;
    });

    it('should add remind success', function* () {
      remind = yield birthday.addRemindAsync(setting.setting_id);
      expect(remind).to.include.keys(['remind_id', 'is_remind']);
    });
  });

  describe('findNowRemindAsync', function () {
    it('should return now remind success', function* () {
      let reminds = yield birthday.findNowRemindAsync();
      expect(reminds).to.be.an('array');
    });
  });

  describe('updateRemindAsync', function () {
    it('should return false if remind not found', function* () {
      let tmp_remind = yield birthday.updateRemindAsync(-1);
      expect(tmp_remind).to.be.false;
    });

    it('should update remind success', function* () {
      let is_remind = true;
      remind = yield birthday.updateRemindAsync(remind.remind_id, {is_remind});
      expect(remind.is_remind).to.equal(is_remind);
    });
  });

  describe('addLogAsync', function () {
    it('should return false if user not found', function* () {
      let tmp_user = yield birthday.addLogAsync(-1);
      expect(tmp_user).to.be.false;
    });

    it('should add logs success', function* () {
      let content = 'test content';
      let log = yield birthday.addLogAsync(user.user_id, {content});
      expect(log.content).to.equal(content);
    });
  });

  describe('removeSettingAsync', function () {
    it('should return false if setting not found', function* () {
      let tmp_setting = yield birthday.removeSettingAsync(-1);
      expect(tmp_setting).to.be.false;
    });

    it('should remove setting success', function* () {
      yield birthday.removeSettingAsync(setting.setting_id);
      let tmp_setting = yield birthday.getSettingAsync(setting.setting_id);
      expect(tmp_setting).to.be.false;
    });
  });

  describe('removeBirthAsync', function () {
    it('should return false if birth not found', function* () {
      let tmp_birth = yield birthday.removeBirthAsync(-1);
      expect(tmp_birth).to.be.false;
    });

    it('should add setting success', function* () {
      let advance = random.birthday.getSettingAdvance();
      let time = random.birthday.getSettingTime();
      setting = yield birthday.addSettingAsync(birth.birth_id, {advance, time});
      expect(setting).to.include.keys(['setting_id', 'advance', 'time']);
    });

    it('should remove birth and setting success', function* () {
      yield birthday.removeBirthAsync(birth.birth_id);
      let tmp_birth = yield birthday.getBirthAsync(birth.birth_id);
      let tmp_setting = yield birthday.getSettingAsync(setting.setting_id);
      expect(tmp_birth).to.be.false;
      expect(tmp_setting).to.be.false;
    });
  });

  describe('removeUserAsync', function () {
    it('should return false if user not found', function* () {
      let tmp_user = yield birthday.removeUserAsync(-1);
      expect(tmp_user).to.be.false;
    });

    it('should add birth success', function* () {
      birth = yield utility.birthday.createTestBirthAsync(user.user_id);
      expect(birth).to.include.keys(['birth_id', 'title', 'type', 'date']);
    });

    it('should add setting success', function* () {
      let advance = random.birthday.getSettingAdvance();
      let time = random.birthday.getSettingTime();
      setting = yield birthday.addSettingAsync(birth.birth_id, {advance, time});
      expect(setting).to.include.keys(['setting_id', 'advance', 'time']);
    });

    it('should remove user and birth and setting success', function* () {
      yield birthday.removeUserAsync(user.user_id);
      let tmp_user = yield birthday.getUserAsync(user.user_id);
      let tmp_birth = yield birthday.getBirthAsync(birth.birth_id);
      let tmp_setting = yield birthday.getSettingAsync(setting.setting_id);
      expect(tmp_user).to.be.false;
      expect(tmp_birth).to.be.false;
      expect(tmp_setting).to.be.false;
    });
  });
});
