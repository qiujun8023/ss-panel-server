'use strict';

let base_path = '/api/birthday/oauth';

describe(base_path, function () {
  describe('get', function () {
    it('should throw error with invalid code', function* () {
      yield api.get(base_path)
        .query({code: 'invalid code'})
        .expect(400);
    });
  });
});
