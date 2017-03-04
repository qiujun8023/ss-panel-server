'use strict';

const ss = require('../../service/ss');
const format = require('../../lib/format').ss;

module.exports = {
  *get(req, res) {
    let result = [];
    let offers = yield ss.findOfferAsync();
    for (let offer of offers) {
      result.push(format.offer(offer));
    }
    res.json(result);
  },
};
