'use strict';

let base_path = '/api/upyun/directories';

describe(base_path, function () {
  this.timeout(10000);
  let path = '/___for_test___';

  describe('put', function () {
    it('should create directory success', function* () {
      yield api.put(base_path)
        .send({path})
        .expect(200);
    });
  });

  describe('get', function () {
    it('should list file success', function* () {
      yield api.get(base_path)
        .query({path})
        .expect(200);
    });
  });

  describe('delete', function () {
    it('should remove directory success', function* () {
      yield api.delete(base_path)
        .query({path})
        .expect(200);
    });
  });
});
