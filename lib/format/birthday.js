'use strict';

const _ = require('lodash');

let birthday = module.exports = {};

birthday.birth = function (data) {
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
  return _.pick(data, filter);
};

birthday.setting = function (data) {
  let filter = ['setting_id', 'advance', 'time'];
  return _.pick(data, filter);
};
