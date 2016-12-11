'use strict';

const expect = require('chai').expect;

const plugins = require('../../lib/test/plugin');
const utility = require('../../lib/test/utility');
const random = require('../../lib/test/random');

let base_path = '/api/birthday/setting';
let user_plugin = plugins.user();

describe(base_path, function () {
  let birth;
  let setting;

  before(function* () {
    let user = yield user_plugin.before('birthday');
    birth = yield utility.birthday.createTestBirthAsync(user.user_id);
  });

  after(function* () {
    yield user_plugin.after();
    yield utility.birthday.removeTestBirthAsync(birth);
  });

  describe('post', function () {
    it('should return error with invalid advance', function* () {
      let res = yield api.post(base_path)
        .use(user_plugin.plugin())
        .send({
          birth_id: birth.birth_id,
          advance: -1,
          time: random.birthday.getSettingTime(),
        })
        .expect(400);

      expect(res.body.type).to.equal('InvalidParameter');
    });

    it('should throw not found with invalid birth_id', function* () {
      yield api.post(base_path)
        .use(user_plugin.plugin())
        .send({
          birth_id: -1,
          advance: random.birthday.getSettingAdvance(),
          time: random.birthday.getSettingTime(),
        })
        .expect(404);
    });

    it('should add setting success', function* () {
      let res = yield api.post(base_path)
        .use(user_plugin.plugin())
        .send({
          birth_id: birth.birth_id,
          advance: random.birthday.getSettingAdvance(),
          time: random.birthday.getSettingTime(),
        })
        .expect(201);
      setting = res.body;
    });
  });

  describe('get', function () {
    it('should throw not found with invalid birth_id', function* () {
      yield api.get(base_path)
        .use(user_plugin.plugin())
        .query({
          birth_id: -1,
        })
        .expect(404);
    });

    it('should return setting list', function* () {
      let birth_id = birth.birth_id;
      let res = yield api.get(base_path)
        .use(user_plugin.plugin())
        .query({birth_id})
        .expect(200);
      expect(res.body.length).to.equal(1);
    });
  });

  describe('delete', function () {
    it('should return not found with invalid setting_id', function* () {
      yield api.delete(base_path)
        .use(user_plugin.plugin())
        .query({
          setting_id: -1,
        })
        .expect(404);
    });

    it('should delete setting success', function* () {
      let birth_id = birth.birth_id;
      let setting_id = setting.setting_id;
      yield api.delete(base_path)
        .use(user_plugin.plugin())
        .query({setting_id})
        .expect(200);
      let res = yield api.get(base_path)
        .use(user_plugin.plugin())
        .query({birth_id})
        .expect(200);
      expect(res.body.length).to.equal(0);
    });
  });
});
