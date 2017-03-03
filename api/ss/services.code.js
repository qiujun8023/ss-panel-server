'use strict';

const ss = require('../../service/ss');
const format = require('../../lib/format').ss;

module.exports = {
  *get(req, res) {
    let user_id = req.session.ss.user.user_id;
    let services = yield ss.findServiceAsync(user_id);

    for (let i = 0; i < services.length; i++) {
      services[i] = format.service(services[i]);
    }

    res.json(services);
  },
};
