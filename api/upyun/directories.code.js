'use strict';

const upyun = require('../../service/upyun');

module.exports = {
  *get(req, res) {
    let path = req.query.path;
    let files = yield upyun.listDirAsync(path || '/');
    res.json(files);
  },

  *put(req, res) {
    yield upyun.makeDirAsync(req.body.path);
    res.json([]);
  },

  *delete(req, res) {
    yield upyun.removeDirAsync(req.query.path);
    res.json({result: true});
  },
};
