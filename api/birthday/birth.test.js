'use strict';

const expect = require('chai').expect;

const plugins = require('../../lib/test/plugin');
const random = require('../../lib/test/random');

let base_path = '/api/birthday/birth';
let user_plugin = plugins.user();

describe(base_path, function () {
  let birth;

  before(function* () {
    yield user_plugin.before('birthday');
  });

  after(function* () {
    yield user_plugin.after();
  });

  describe('post', function () {
    it('should return error with invalid type', function* () {
      let res = yield api.post(base_path)
        .use(user_plugin.plugin())
        .send({
          title: random.birthday.getBirthTitle(),
          type: 'invalid type',
          date: random.birthday.getBirthDate(),
        })
        .expect(400);

      expect(res.body.type).to.equal('InvalidParameter');
    });

    it('should add birth success', function* () {
      let res = yield api.post(base_path)
        .use(user_plugin.plugin())
        .send({
          title: random.birthday.getBirthTitle(),
          type: random.birthday.getBirthType(),
          date: random.birthday.getBirthDate(),
        })
        .expect(201);
      birth = res.body;
    });
  });

  describe('get', function () {
    it('should return birth list', function* () {
      let res = yield api.get(base_path)
        .use(user_plugin.plugin())
        .expect(200);
      expect(res.body.length).to.equal(1);
    });
  });

  describe('put', function () {
    it('should return error if birth not found', function* () {
      yield api.put(base_path)
        .use(user_plugin.plugin())
        .send({
          birth_id: -1,
          title: random.birthday.getBirthTitle(),
          type: random.birthday.getBirthType(),
          date: random.birthday.getBirthDate(),
        })
        .expect(404);
    });

    it('should update birth success', function* () {
      let birth_id = birth.birth_id;
      let title = random.birthday.getBirthTitle();
      let type = random.birthday.getBirthType();
      let date = random.birthday.getBirthDate();
      let res = yield api.put(base_path)
        .use(user_plugin.plugin())
        .send({birth_id, title, type, date})
        .expect(200);
      expect(res.body.title).to.equal(title);
      expect(res.body.type).to.equal(type);
      expect(res.body.date).to.equal(date);
    });
  });

  describe('delete', function () {
    it('should delete birth success', function* () {
      let birth_id = birth.birth_id;
      yield api.delete(base_path)
        .use(user_plugin.plugin())
        .query({birth_id})
        .expect(200);
      yield api.delete(base_path)
        .use(user_plugin.plugin())
        .query({birth_id})
        .expect(404);
    });
  });
});
