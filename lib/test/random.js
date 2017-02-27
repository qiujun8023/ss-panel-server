'use strict';

const Chance = require('chance');
const moment = require('moment');

let chance = new Chance();

chance.birthday = {
  getUserId() {
    return chance.word({length: 10});
  },
  getUserName() {
    return chance.word({length: 8});
  },
  getUserGender() {
    return chance.pickone(['未知', '男', '女']);
  },
  getUserMobile() {
    return '130' + chance.string({length: 8, pool: '0123456789'});
  },
  getUserEmail() {
    return chance.email();
  },
  getUserAvatar() {
    return chance.avatar();
  },
  getBirthTitle() {
    return chance.word({length: 8});
  },
  getBirthType() {
    return chance.pickone(['SOLAR', 'LUNAR']);
  },
  getBirthDate() {
    let year = chance.integer({min: 1950, max: 2015});
    let date = chance.date({year});
    return moment(date).format('YYYY-MM-DD');
  },
  getSettingAdvance() {
    return chance.integer({min: 0, max: 20});
  },
  getSettingTime() {
    let hour = chance.hour({twentyfour: true});
    let minute = chance.minute();
    return `${('00' + hour).slice(-2)}:${('00' + minute).slice(-2)}`;
  },
};

module.exports = chance;
