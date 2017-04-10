'use strict';

const path = require('path');

let base_path = '/api/upyun/files';

describe(base_path, function () {
  this.timeout(10000);
  let dir_name = '/';
  let file_name = '___for_test___.md';
  let file_from = path.join(__dirname, '../../../README.md');

  describe('put', function () {
    it('should throw error', function* () {
      yield api.put(base_path)
        .attach('files', file_from, file_name)
        .expect(400);
    });

    it('should upload file success', function* () {
      yield api.put(base_path)
        .field('path', dir_name)
        .attach('files', file_from, file_name)
        .expect(200);
    });
  });

  describe('get', function () {
    it('should get file success', function* () {
      let file_path = path.join(dir_name, file_name);
      yield api.get(base_path)
        .query({path: file_path})
        .expect(200);
    });
  });

  describe('delete', function () {
    it('should remove file success', function* () {
      let file_path = path.join(dir_name, file_name);
      yield api.delete(base_path)
        .query({path: file_path})
        .expect(200);
    });
  });
});
