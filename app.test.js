'use strict';

describe('app', function () {
  it('should return 404 if path not exist', function* () {
    yield api.get('/path/to/invalid').expect(404);
  });
});
