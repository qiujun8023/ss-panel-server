'use strict';

const _ = require('lodash');
const moment = require('moment');

const errors = require('../../lib/errors');
const network = require('../../service/network');

module.exports = {
  *get(req, res) {
    let year = req.query.year;
    let month = req.query.month && req.query.month - 1;
    let day = req.query.day;

    let options = {year, month, day};
    options = _.pickBy(options, (v) => Boolean(v));
    options = _.assign(options, {hour: 0, minute: 0, second: 0, millisecond: 0});
    let date = moment(options);
    if (!date.isValid()) {
      throw new errors.BadRequest('日期不合法');
    }

    let result = {};
    if ((year || month) && !day) {
      let time = yield network.getTimeByDayAsync(date);
      let speed = yield network.getSpeedByDayAsync(date);
      result = _.assign({type: 'day'}, time, speed);
    } else {
      let time = yield network.getTimeByHourAsync(date);
      let speed = yield network.getSpeedByHourAsync(date);
      result = _.assign({type: 'hour'}, time, speed);
    }

    res.json(result);
  },
};
