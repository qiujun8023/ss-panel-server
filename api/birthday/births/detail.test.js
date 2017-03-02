'use strict';

const plugins = require('../../../lib/test/plugin');
const utility = require('../../../lib/test/utility');

let base_path = '/api/birthday/births/detail';
let user_plugin = plugins.user();

describe(base_path, function () {
  let birth;

  before(function* () {
    let user = yield user_plugin.before('birthday');
    birth = yield utility.birthday.createTestBirthAsync(user.user_id);
  });

  after(function* () {
    yield utility.birthday.removeTestBirthAsync(birth);
    yield user_plugin.after();
  });

  describe('get', function () {
    it('should return birth detail', function* () {
      yield api.get(base_path)
        .query({birth_id: birth.birth_id})
        .use(user_plugin.plugin())
        .expect(200);
    });
  });
});
