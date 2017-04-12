'use strict';

const _ = require('lodash');

const format = require('../../lib/format').upyun;
const upyun = require('../../service/upyun');

module.exports = {
  *get(req, res) {
    let spiders = yield upyun.findSpiderAsync({}, 20);

    let result = [];
    for (let spider of spiders) {
      result.push(format.spider(spider));
    }
    res.json(result);
  },

  *post(req, res) {
    let data = _.pick(req.body, ['save_name', 'request_url']);
    let spider = yield upyun.addSpiderAsync(data);
    let result = yield upyun.getSpiderAsync(spider.spider_id);
    res.status(201).json(format.spider(result));
  },

  *delete(req, res) {
    let spider_id = req.query.spider_id;
    yield upyun.removeSpiderAsync(spider_id);
    res.json({result: true});
  },
};
