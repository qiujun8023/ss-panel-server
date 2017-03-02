'use strict';

const plugins = require('../../../lib/test/plugin');
const utility = require('../../../lib/test/utility');
const random = require('../../../lib/test/random');

let base_path = '/api/birthday/settings/detail';
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
    it('should return setting detail', function* () {
      let res = yield api.post('/api/birthday/settings')
        .use(user_plugin.plugin())
        .send({
          birth_id: birth.birth_id,
          advance: random.birthday.getSettingAdvance(),
          time: random.birthday.getSettingTime(),
        })
        .expect(201);

      let setting = res.body;

      yield api.get(base_path)
        .query({setting_id: setting.setting_id})
        .use(user_plugin.plugin())
        .expect(200);
    });
  });
});
