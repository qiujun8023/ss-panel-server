'use strict';

const ss = require('../../service/ss');
const format = require('../../lib/format').ss;

module.exports = {
  *get(req, res) {
    let user_id = req.session.ss.user.user_id;
    let service = yield ss.findServiceAsync(user_id);

    res.json(format.service(service));
  },
};
