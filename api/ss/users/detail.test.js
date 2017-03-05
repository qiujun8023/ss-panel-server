'use strict';

const plugins = require('../../../lib/test/plugin');

let base_path = '/api/ss/users/detail';
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
    it('should return error if user not found', function* () {
      yield api.get(base_path)
        .query({user_id: -1})
        .use(user_plugin.plugin())
        .expect(404);
    });

    it('should return user detail', function* () {
      yield api.get(base_path)
        .query({user_id: user.user_id})
        .use(user_plugin.plugin())
        .expect(200);
    });
  });
});
