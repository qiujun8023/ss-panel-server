'use strict';

const upyun = require('../../service/upyun');

module.exports = {
  *get(req, res) {
    let path = req.query.path;
    let files = yield upyun.listFileAsync(path || '/');
    res.json(files);
  },
};
