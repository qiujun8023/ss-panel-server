'use strict';

const expect = require('chai').expect;

const plugins = require('../../lib/test/plugin');
const random = require('../../lib/test/random');

let base_path = '/api/birthday/list';
let user_plugin = plugins.user();

describe(base_path, function () {
  before(function* () {
    yield user_plugin.before('birthday');
  });

  after(function* () {
    yield user_plugin.after();
  });

  describe('get', function () {
    it('should return birth list', function* () {
      let res = yield api.get(base_path)
        .use(user_plugin.plugin())
        .expect(200);
      expect(res.body.length).to.equal(0);
    });
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
      let title = random.birthday.getBirthTitle();
      let type = random.birthday.getBirthType();
      let date = random.birthday.getBirthDate();
      yield api.post(base_path)
        .use(user_plugin.plugin())
        .send({title, type, date})
        .expect(201);

      let res = yield api.get(base_path)
        .use(user_plugin.plugin())
        .expect(200);
      expect(res.body.length).to.equal(1);
      expect(res.body[0].title).to.equal(title);
      expect(res.body[0].type).to.equal(type);
      expect(res.body[0].date).to.equal(date);
    });
  });

});
