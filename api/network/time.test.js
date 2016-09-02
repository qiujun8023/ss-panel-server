'use strict';

const ENDPOINT = '/api/network/time';

describe(ENDPOINT, function () {
  describe('get', function () {
    it('should return error without url', function* () {
      yield api.get(ENDPOINT).expect(400);
    });

    it('should request failure with invalid url', function* () {
      yield api.get(ENDPOINT)
        .query({
          url: 'invalid url',
        })
        .expect(502);
    });

    it('should request success', function* () {
      yield api.get(ENDPOINT)
        .query({
          url: 'https://www.baidu.com',
        })
        .expect(200);
    });
  });
});
