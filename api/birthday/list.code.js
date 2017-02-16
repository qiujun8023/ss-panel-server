'use strict';

const _ = require('lodash');

const birthday = require('../../service/birthday');

let birthFormat = function (birth) {
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
      result.push(birthFormat(birth));
    }
    res.json(result);
  },

  *post(req, res) {
    let user_id = req.session.user.user_id;
    let data = _.pick(req.body, ['title', 'type', 'date']);
    let birth = yield birthday.addBirthAsync(user_id, data);
    res.status(201).json(birthFormat(birth));
  },
};
