'use strict';

const path = require('path');

const glob = require('glob');

const errors = require('../lib/errors');
const router = require('../lib/express').Router();

const CWD = path.join(__dirname, '../');

glob.sync('api/**/*.js', {cwd: CWD}).map((file) => {
  let uri = '/' + file.slice(0, -('.js'.length));
  let uris = [uri];
  if (uri.endsWith('/index')) {
    uris.push(uri.slice(0, -('/index'.length)));
  }

  let location = path.join(CWD, file);
  let handlers = require(location);

  uris.map((item) => {
    for (let handler in handlers) {
      router[handler](item, handlers[handler]);
    }
  });
});

// 抛出API接口的404错误
router.use('/api', function () {
  throw new errors.NotFound('page not found');
});

module.exports = router;
