'use strict';

const _ = require('lodash');

const errors = require('../../../lib/errors');
const birthday = require('../../../service/birthday');

module.exports = {
  *get(req, res) {
    let user_id = req.session.birthday.user.user_id;
    let birth_id = req.query.birth_id;

    let birth = yield birthday.getBirthAsync(birth_id);
    if (!birth || birth.user_id !== user_id) {
      throw new errors.NotFound('未找到相关生日');
    }

    let filter = [
      'birth_id',
      'title',
      'type',
      'year',
      'month',
      'day',
      'days',
      'date',
      'zodiac',
      'age',
      'countdown',
      'constellation',
    ];
    res.json(_.pick(birth, filter));
  },
};
