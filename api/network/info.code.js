'use strict';

const request = require('co-request');

const errors = require('../../lib/errors');
const network = require('../../service/network');

module.exports = {
  *post(req, res) {
    let url = req.body.url;
    let timeout = Number(req.body.timeout) || 2000;
    let record = req.body.record === 'Y';

    let response;
    let options = {url, timeout, time: true};
    try {
      response = yield request(options);
    } catch (e) {
      throw new errors.BadGateway(e.message);
    }

    let client_ip = req.ip;
    let size = response.socket.bytesRead;
    let time_elapsed = response.elapsedTime;
    let speed = (size / time_elapsed * 1000 * 8).toFixed(0);

    let result = {
      time_elapsed: time_elapsed + ' ms',
      size: size + ' bytes',
      speed: speed + ' bps',
      speed_format: network.format(speed),
    };

    if (record) {
      yield network.addInfoAsync({
        client_ip,
        time_elapsed,
        size,
        speed,
      });
    }

    res.send(result);
  },
};
