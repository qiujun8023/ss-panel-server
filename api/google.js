'use strict';

const request = require('co-request');

const errors = require('../lib/errors');

module.exports = {
  *get(req, res) {
    let options = {
      url: 'https://www.google.com',
      timeout: 3000
    };

    try {
      yield request(options);
    } catch (e) {
      throw new errors.BadGateway('Get google timeout after 3000ms');
    }

    res.send({result: 'ok'});
  }
};
