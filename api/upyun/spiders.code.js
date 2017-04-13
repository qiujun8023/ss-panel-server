'use strict';

const _ = require('lodash');
const moment = require('moment');

const format = require('../../lib/format').upyun;
const errors = require('../../lib/errors');
const upyun = require('../../service/upyun');

module.exports = {
  *get(req, res) {
    let spiders = yield upyun.findSpiderAsync({}, 20, 'spider_id desc');

    let result = [];
    for (let spider of spiders) {
      result.push(format.spider(spider));
    }
    res.json(result);
  },

  *post(req, res) {
    let date = moment().format('YYYYMMDD/');
    let data = _.pick(req.body, ['save_name', 'request_url']);
    data.save_path = '/spider/' + date + data.save_name;

    try {
      let spider = yield upyun.addSpiderAsync(data);
      let result = yield upyun.getSpiderAsync(spider.spider_id);
      res.status(201).json(format.spider(result));
    } catch (err) {
      throw new errors.BadRequest('保存失败，可能文件名已存在');
    }
  },

  *delete(req, res) {
    let spider_id = req.query.spider_id;
    yield upyun.removeSpiderAsync(spider_id);
    res.json({result: true});
  },
};
