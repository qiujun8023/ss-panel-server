'use strict';

const _ = require('lodash');

const random = require('../random');
const birthdayService = require('../../../service/birthday');

let birthday = module.exports = {};

birthday.createTestUserAsync = function* (opts) {
  let data = _.assign({
    user_id: random.birthday.getUserId(),
    name: random.birthday.getUserName(),
    gender: random.birthday.getUserGender(),
    mobile: random.birthday.getUserMobile(),
    email: random.birthday.getUserEmail(),
    avatar: random.birthday.getUserAvatar(),
  }, opts || {});

  return yield birthdayService.addOrUpdateUserAsync(data);
};

birthday.removeTestUserAsync = function* (user) {
  return yield birthdayService.removeUserAsync(user.user_id);
};

birthday.createTestBirthAsync = function* (user_id, opts) {
  let data = _.assign({
    title: random.birthday.getBirthTitle(),
    type: random.birthday.getBirthType(),
    date: random.birthday.getBirthDate(),
  }, opts || {});

  return yield birthdayService.addBirthAsync(user_id, data);
};

birthday.removeTestBirthAsync = function* (birth) {
  return yield birthdayService.removeBirthAsync(birth.birth_id);
};
