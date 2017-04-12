'use strict';

const download = require('download');

const cron = require('../lib/cron');
const upyunService = require('../service/upyun');

let getSpiderTaskAsync = function* () {
  let ms = 10 * 60 * 1000;
  let spiders = yield upyunService.findSpiderAsync({
    $or: {
      status: 'ADDED',
      $and: {
        status: 'DOWNLOADING',
        updated_at: {
          $lt: new Date(new Date() - ms),
        },
      },
    },
  }, 1);

  if (!spiders || !spiders.length) {
    return false;
  }

  let spider_id = spiders[0].spider_id;
  return yield upyunService.updateSpiderAsync(spider_id, {
    status: 'DOWNLOADING',
    updated_at: new Date(),
  });
};

let execSpiderTaskAsync = function* (spider, times) {
  times = times || 1;
  if (times >= 3) {
    return false;
  }

  try {
    let content = yield download(spider.request_url);
    yield upyunService.putFileAsync(spider.save_path, content);
  } catch (err) {
    return yield execSpiderTaskAsync(spider, times + 1);
  }

  return true;
};

// 离线下载
let offlineDownload = cron('*/5 * * * * *', function* () {
  let spider = yield getSpiderTaskAsync();
  if (!spider) {
    return;
  }

  let status = (yield execSpiderTaskAsync(spider)) ? 'COMPLETE' : 'FAILURE';
  yield upyunService.updateSpiderAsync(spider.spider_id, {status});
});


module.exports = {
  offlineDownload,
};
