'use strict';

const _ = require('lodash');

const errors = require('../../lib/errors');
const birthday = require('../../service/birthday');

let format = function (birth) {
  let filter = [
    'birth_id',
    'title',
    'type',
    'date',
    'date_formart',
    'zodiac',
    'age',
    'countdown',
    'constellation',
  ];
  return _.pick(birth, filter);
};

module.exports = {
  *get(req, res) {
    let user_id = req.session.user.user_id;
    let births = yield birthday.findBirthAsync(user_id);

    let result = [];
    for (let birth of births) {
      result.push(format(birth));
    }
    res.json(result);
  },

  *post(req, res) {
    let user_id = req.session.user.user_id;
    let data = _.pick(req.body, ['title', 'type', 'date']);
    let birth = yield birthday.addBirthAsync(user_id, data);
    res.status(201).json(format(birth));
  },

  *put(req, res) {
    let user_id = req.session.user.user_id;
    let birth_id = req.body.birth_id;
    let data = _.pick(req.body, ['title', 'type', 'date']);

    // 判断所有权
    let birth = yield birthday.getBirthAsync(birth_id);
    if (!birth || birth.user_id !== user_id) {
      throw new errors.NotFound('未找到相关生日');
    }

    birth = yield birthday.updateBirthAsync(birth_id, data);
    res.json(format(birth));
  },

  *delete(req, res) {
    let user_id = req.session.user.user_id;
    let birth_id = req.query.birth_id;

    // 判断所有权
    let birth = yield birthday.getBirthAsync(birth_id);
    if (!birth || birth.user_id !== user_id) {
      throw new errors.NotFound('未找到相关生日');
    }

    yield birthday.removeBirthAsync(birth_id);
    res.json({result: true});
  },
};
