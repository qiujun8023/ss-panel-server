'use strict';

const moment = require('moment');
const request = require('co-request');

const errors = require('../../lib/errors');

module.exports = {
  *get(req, res) {
    let t1 = moment().format('x');
    let options = {
      url: 'https://www.google.com',
      timeout: 3000
    };

    try {
      yield request(options);
    } catch (e) {
      throw new errors.BadGateway('Get google timeout after 3000ms');
    }

    let diff = moment().format('x') - t1;
    let result = {
      status: 'ok',
      time: `${diff}ms`
    };
    res.send(result);
  }
};
