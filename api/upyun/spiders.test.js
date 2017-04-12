'use strict';

const random = require('../../lib/test/random').upyun;

let base_path = '/api/upyun/spiders';

describe(base_path, function () {
  let spider;

  describe('get', function () {
    it('should return spider list', function* () {
      yield api.get(base_path)
        .expect(200);
    });
  });

  describe('post', function () {
    it('should add spider success', function* () {
      let res = yield api.post(base_path)
        .send({
          save_name: random.getSpiderSaveName(),
          request_url: random.getSpiderRequestUrl(),
        })
        .expect(201);
      spider = res.body;
    });
  });

  describe('delete', function () {
    it('should delete spider success', function* () {
      let spider_id = spider.spider_id;
      yield api.delete(base_path)
        .query({spider_id})
        .expect(200);
    });
  });
});
