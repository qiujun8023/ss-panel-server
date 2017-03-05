'use strict';

const expect = require('chai').expect;
const config = require('config');

const plugins = require('../../lib/test/plugin');
const random = require('../../lib/test/random');

let base_path = '/api/ss/users';
let user_plugin = plugins.user();

describe(base_path, function () {
  let user;

  before(function* () {
    user = yield user_plugin.before('ss', {is_admin: true});
  });

  after(function* () {
    yield user_plugin.after();
  });

  describe('get', function () {
    it('should return user list', function* () {
      yield api.get(base_path)
        .use(user_plugin.plugin())
        .expect(200);
    });
  });

  describe('put', function () {
    it('should return error if user not found', function* () {
      yield api.put(base_path)
        .use(user_plugin.plugin())
        .send({user_id: 'invalid user'})
        .expect(404);
    });

    it('should return error with invalid port', function* () {
      let user_id = user.user_id;
      let port = config.ss.max_port + 1;
      yield api.put(base_path)
        .use(user_plugin.plugin())
        .send({user_id, port})
        .expect(400);
    });

    it('should return error with invalid transfer_enable', function* () {
      let user_id = user.user_id;
      let transfer_enable = -1;
      yield api.put(base_path)
        .use(user_plugin.plugin())
        .send({user_id, transfer_enable})
        .expect(400);
    });

    it('should update user success', function* () {
      let user_id = user.user_id;
      let password = random.ss.getUserPassword();
      let res = yield api.put(base_path)
        .use(user_plugin.plugin())
        .send({user_id, password})
        .expect(200);
      expect(res.body.password).to.equal(password);
    });
  });
});
