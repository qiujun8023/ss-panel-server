'use strict';

const ENDPOINT = '/api/index';

describe(ENDPOINT, function () {
  describe('get', function () {
    it('should return 200', function* () {
      yield api.get(ENDPOINT).expect(200);
    });
  });
});
