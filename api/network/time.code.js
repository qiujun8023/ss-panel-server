'use strict';

const request = require('co-request');

const errors = require('../../lib/errors');

module.exports = {
  *get(req, res) {
    let url = req.query.url;
    let timeout = Number(req.query.timeout) || 2000;

    let t1 = new Date().getTime();
    let options = {url, timeout};

    try {
      yield request(options);
    } catch (e) {
      throw new errors.BadGateway(e.message);
    }

    let diff = new Date().getTime() - t1;
    let result = {
      result: true,
      time: `${diff}ms`
    };
    res.send(result);
  }
};
