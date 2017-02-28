'use strict';

let base_path = '/api/cdn/upyun';

describe(base_path, function () {
  describe('get', function () {
    it('should list file success or not', function* () {
      this.timeout(5000);
      yield api.get('/api/cdn/upyun');
    });
  });
});
