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

    let size = response.socket.bytesRead;
    let time = response.elapsedTime;
    let speed = (size / time * 1000 * 8).toFixed(0);
    yield network.addSpeedAsync({time, size, speed});

    let result = {
      time: time + ' ms',
      size: size + ' bytes',
      speed: speed + ' bps',
      speed_format: network.format('speed', speed),
    };

    res.json(result);
  },
};
