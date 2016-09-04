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
      result.type = 'day';
      result.data = yield network.getInfoByDayAsync(date);
    } else {
      result.type = 'hour';
      result.data = yield network.getInfoByHourAsync(date);
    }

    res.send(result);
  },
};
