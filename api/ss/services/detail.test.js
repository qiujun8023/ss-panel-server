'use strict';

const plugins = require('../../../lib/test/plugin');
const utility = require('../../../lib/test/utility');

let base_path = '/api/ss/services/detail';
let user_plugin = plugins.user();

describe(base_path, function () {
  let node;

  before(function* () {
    yield user_plugin.before('ss');
    node = yield utility.ss.createTestNodeAsync();
  });

  after(function* () {
    yield utility.ss.removeTestNodeAsync(node);
    yield user_plugin.after();
  });

  describe('get', function () {
    it('should return error if service not found', function* () {
      yield api.get(base_path)
        .query({service_id: -1})
        .use(user_plugin.plugin())
        .expect(404);
    });

    it('should return node detail', function* () {
      yield api.get(base_path)
        .query({service_id: node.node_id})
        .use(user_plugin.plugin())
        .expect(200);
    });
  });
});
