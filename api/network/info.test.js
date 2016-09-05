'use strict';

const expect = require('chai').expect;

const ENDPOINT = '/api/network/info';

describe(ENDPOINT, function () {
  describe('get', function () {
    it('should request failure with invalid date', function* () {
      yield api.get(ENDPOINT)
        .query({
          year: 2016,
          month: 2,
          day: 31,
        })
        .expect(400);
    });

    it('should returns daily statistics', function* () {
      let res = yield api.get(ENDPOINT)
        .query({
          month: 12,
        })
        .expect(200);
      expect(res.body.type).to.equal('day');
    });

    it('should returns hourly statistics', function* () {
      let res = yield api.get(ENDPOINT)
        .query({
          day: 1,
        })
        .expect(200);
      expect(res.body.type).to.equal('hour');
    });
  });
});
