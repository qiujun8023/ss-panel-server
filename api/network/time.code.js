'use strict';

const request = require('co-request');

const errors = require('../../lib/errors');
const network = require('../../service/network');

module.exports = {
  *post(req, res) {
    let url = req.body.url;
    let timeout = Number(req.body.timeout) || 2000;

    let response;
    let options = {url, timeout, time: true};
    try {
      response = yield request(options);
    } catch (e) {
      throw new errors.BadGateway(e.message);
    }

    let time = response.elapsedTime;
    yield network.addTimeAsync({time});

    let result = {
      time: time + ' ms',
    };

    res.send(result);
  },
};
