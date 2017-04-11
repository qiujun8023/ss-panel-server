'use strict';

const path = require('path');

const expect = require('chai').expect;

const upyun = require('./upyun');

describe('server/service/upyun', function () {
  this.timeout(10000);
  let dir_name = '/___for_test___';
  let file_name = '___for_test___.txt';

  describe('sortFile', function () {
    it('should sort files success', function () {
      let files = upyun.sortFile([
        {
          type: 'F',
          name: '1',
        }, {
          type: 'N',
          name: '1',
        }, {
          type: 'F',
          name: '2',
        }, {
          type: 'N',
          name: '2',
        },
      ]);
      expect(files[0].type).to.equal('F');
      expect(files[0].name).to.equal('1');
      expect(files[3].type).to.equal('N');
      expect(files[3].name).to.equal('2');
    });
  });

  describe('formatFile', function () {
    it('should format file success', function () {
      let file = upyun.formatFile('/', {
        name: 'test',
        size: '0',
        time: '1482908372',
      });
      expect(file).to.include.keys(['size_v', 'time_v', 'url']);
    });
  });

  describe('makeDirAsync', function () {
    it('should make dir success', function* () {
      let res = yield upyun.makeDirAsync(dir_name);
      expect(res).to.be.true;
    });
  });

  describe('putFileAsync', function () {
    it('should put file success', function* () {
      let buffer = new Buffer('Hello');
      let remote_path = path.join(dir_name, file_name);
      let res = yield upyun.putFileAsync(remote_path, buffer);
      expect(res).to.be.true;
    });
  });

  describe('headFileAsync', function () {
    it('should head file success', function* () {
      let remote_path = path.join(dir_name, file_name);
      let res = yield upyun.headFileAsync(remote_path);
      expect(res.name).to.equal(file_name);
    });
  });

  describe('listDirAsync', function () {
    it('should get file list success', function* () {
      let files = yield upyun.listDirAsync(dir_name);
      expect(files.length).to.equal(1);
      expect(files[0].name).to.equal(file_name);
    });
    it('should throw error if dir not found', function* () {
      let error;
      try {
        yield upyun.listDirAsync('___invalid_path___');
      } catch (err) {
        error = err;
        expect(error).to.be.an.instanceof(Error);
        return;
      }
      throw new Error('list dir should throw error but not');
    });
  });

  describe('deleteFileAsync', function () {
    it('should remove file success', function* () {
      let remote_path = path.join(dir_name, file_name);
      let res = yield upyun.deleteFileAsync(remote_path);
      expect(res).to.be.true;
    });
  });

  describe('removeDirAsync', function () {
    it('should remove dir success', function* () {
      let res = yield upyun.removeDirAsync(dir_name);
      expect(res).to.be.true;
    });
  });
});
