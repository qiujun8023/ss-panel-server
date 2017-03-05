'use strict';

const plugins = require('../../lib/test/plugin');

let base_path = '/api/ss/offers';
let user_plugin = plugins.user();

describe(base_path, function () {
  before(function* () {
    yield user_plugin.before('ss');
  });

  after(function* () {
    yield user_plugin.after();
  });

  describe('get', function () {
    it('should return offer list', function* () {
      yield api.get(base_path)
        .use(user_plugin.plugin())
        .expect(200);
    });
  });
});
