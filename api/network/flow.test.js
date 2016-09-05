'use strict';

const expect = require('chai').expect;

const ENDPOINT = '/api/network/flow';

describe(ENDPOINT, function () {
  describe('post', function () {
    it('should not remind', function* () {
      let res = yield api.post(ENDPOINT)
        .send({
          threshold: 9999999999,
        })
        .expect(200);
      expect(res.body.status).to.equal('normal');
    });

    it('should remind', function* () {
      let res = yield api.post(ENDPOINT)
        .send({
          threshold: 0,
        })
        .expect(200);
      expect(res.body.status).to.equal('abnormal');
    });

    it('should use default threshold', function* () {
      yield api.post(ENDPOINT)
        .set('Content-Type', 'application/json')
        .expect(200);
    });
  });
});
