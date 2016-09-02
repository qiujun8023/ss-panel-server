'use strict';

const ENDPOINT = '/api/network/google';

describe(ENDPOINT, function () {
  describe('get', function () {
    it('should get success', function* () {
      this.timeout(5000);
      yield api.get(ENDPOINT);
    });
  });
});
