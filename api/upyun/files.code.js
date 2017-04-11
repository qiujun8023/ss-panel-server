'use strict';

const path = require('path');

const co = require('co');
const multer = require('multer');
const errors = require('../../lib/errors');
const upyun = require('../../service/upyun');

const storage = multer.memoryStorage();
const upload = multer({storage});

module.exports = {
  *get(req, res) {
    let file_path = req.query.path;
    let info = yield upyun.headFileAsync(file_path);
    res.json(info);
  },

  *put(req, res, next) {
    let handle = function (err) {
      if (err) {
        return next(err);
      }

      co(function* () {
        if (!req.files || !req.files.length || !req.body.path) {
          throw new errors.BadRequest('参数有误');
        }

        // 上传所有文件
        let base_path = req.body.path;
        for (let file of req.files) {
          let save_path = path.join(base_path, file.originalname);
          yield upyun.putFileAsync(save_path, file.buffer);
        }

        res.json({result: true});
      }).catch(next);
    };
    upload.array('files')(req, res, handle);
  },

  *delete(req, res) {
    yield upyun.deleteFileAsync(req.query.path);
    res.json({result: true});
  },
};
