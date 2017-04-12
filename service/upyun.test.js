'use strict';

const path = require('path');

const expect = require('chai').expect;

const upyun = require('./upyun');
const random = require('../lib/test/random/upyun');

describe('server/service/upyun', function () {
  this.timeout(10000);
  let dir_name = '/___for_test___';
  let file_name = '___for_test___.txt';
  let spider;

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

  describe('addSpiderAsync', function () {
    it('should add spider success', function* () {
      let save_name = random.getSpiderSaveName();
      let save_path = random.getSpiderSavePath(save_name);
      let request_url = random.getSpiderRequestUrl();
      spider = yield upyun.addSpiderAsync({save_name, save_path, request_url});
      expect(spider).to.include.keys(['spider_id', 'save_name', 'request_url', 'status']);
    });
  });

  describe('getSpiderAsync', function () {
    it('should return false if spider not found', function* () {
      let tmp_spider = yield upyun.getSpiderAsync(-1);
      expect(tmp_spider).to.be.false;
    });

    it('should get spider success', function* () {
      let tmp_spider = yield upyun.getSpiderAsync(spider.spider_id);
      expect(tmp_spider.spider_id).to.equal(spider.spider_id);
      expect(tmp_spider.save_name).to.equal(spider.save_name);
      expect(tmp_spider.request_url).to.equal(spider.request_url);
    });
  });

  describe('findSpiderAsync', function () {
    it('should return spider list success', function* () {
      let spiders = yield upyun.findSpiderAsync();
      expect(spiders.length >= 1).to.be.true;
      expect(spiders[0]).to.include.keys(['spider_id', 'save_name', 'save_path', 'request_url', 'status']);
    });
  });

  describe('updateSpiderAsync', function () {
    it('should return false if spider not found', function* () {
      let tmp_spider = yield upyun.updateSpiderAsync(-1);
      expect(tmp_spider).to.be.false;
    });

    it('should update spider success', function* () {
      let status = random.getSpiderStatus();
      let tmp_spider = yield upyun.updateSpiderAsync(spider.spider_id, {status});
      expect(tmp_spider.status).to.equal(status);
      spider.status = status;
    });
  });

  describe('removeSpiderAsync', function () {
    it('should remove spider success', function* () {
      yield upyun.removeSpiderAsync(spider.spider_id);
    });

    it('should return false if spider not found', function* () {
      let res = yield upyun.removeSpiderAsync(-1);
      expect(res).to.be.false;
    });
  });

});
