'use strict';

const ss = require('../../../service/ss');
const errors = require('../../../lib/errors');
const format = require('../../../lib/format').ss;

module.exports = {
  *get(req, res) {
    let user_id = req.session.ss.user.user_id;
    let node_id = req.query.service_id;

    let service = yield ss.getServiceAsync(user_id, node_id);
    if (!service) {
      throw new errors.NotFound('未找到相关服务');
    }

    res.json(format.service(service));
  },
};
