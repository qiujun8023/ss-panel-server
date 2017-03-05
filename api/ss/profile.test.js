'use strict';

const config = require('config');
const expect = require('chai').expect;

const plugins = require('../../lib/test/plugin');
const random = require('../../lib/test/random');

let base_path = '/api/ss/profile';
let user_plugin = plugins.user();

describe(base_path, function () {

  before(function* () {
    yield user_plugin.before('ss');
  });

  after(function* () {
    yield user_plugin.after();
  });

  describe('get', function () {
    it('should return profile success', function* () {
      yield api.get(base_path)
        .use(user_plugin.plugin())
        .expect(200);
    });
  });

  describe('put', function () {
    it('should return error whih invalid port', function* () {
      let port = config.ss.max_port + 1;
      let res = yield api.put(base_path)
        .use(user_plugin.plugin())
        .send({port})
        .expect(400);
      expect(res.body.type).to.equal('BadRequest');
    });

    it('should update profile success', function* () {
      let password = random.ss.getUserPassword();
      let res = yield api.put(base_path)
        .use(user_plugin.plugin())
        .send({password})
        .expect(200);
      expect(res.body.password).to.equal(password);
    });
  });
});
