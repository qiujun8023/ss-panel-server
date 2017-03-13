'use strict';

const plugins = require('../../../lib/test/plugin');
const utility = require('../../../lib/test/utility');

let base_path = '/api/ss/transfer/stat';
let user_plugin = plugins.user();

describe(base_path, function () {
  let node;

  before(function* () {
    yield user_plugin.before('ss', {is_admin: true});
    node = yield utility.ss.createTestNodeAsync();
  });

  after(function* () {
    yield utility.ss.removeTestNodeAsync(node);
    yield user_plugin.after();
  });

  describe('get', function () {
    it('should return transfer stat', function* () {
      yield api.get(base_path)
        .query({node_id: node.node_id})
        .use(user_plugin.plugin())
        .expect(200);
    });
  });
});
