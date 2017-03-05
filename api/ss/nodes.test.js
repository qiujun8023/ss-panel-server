'use strict';

const expect = require('chai').expect;

const plugins = require('../../lib/test/plugin');
const random = require('../../lib/test/random');

let base_path = '/api/ss/nodes';
let user_plugin = plugins.user();

describe(base_path, function () {
  let node;
  let nodes;

  before(function* () {
    yield user_plugin.before('ss', {is_admin: true});
  });

  after(function* () {
    yield user_plugin.after();
  });

  describe('get', function () {
    it('should return node list', function* () {
      let res = yield api.get(base_path)
        .use(user_plugin.plugin())
        .expect(200);
      nodes = res.body;
    });
  });

  describe('post', function () {
    it('should add node success', function* () {
      let res1 = yield api.post(base_path)
        .use(user_plugin.plugin())
        .send({
          name: random.ss.getNodeName(),
          avatar: random.ss.getNodeAvatar(),
          server: random.ss.getNodeServer(),
          method: random.ss.getNodeMethod(),
          description: random.ss.getNodeDescription(),
          sort: random.ss.getNodeSort(),
          is_visible: random.ss.getNodeIsVisible(),
        })
        .expect(201);
      node = res1.body;

      let res2 = yield api.get(base_path)
        .use(user_plugin.plugin())
        .expect(200);

      expect(res2.body.length - nodes.length).to.equal(1);
    });
  });

  describe('put', function () {
    it('should return error if node not found', function* () {
      yield api.put(base_path)
        .use(user_plugin.plugin())
        .send({node_id: -1})
        .expect(404);
    });

    it('should update node success', function* () {
      let node_id = node.node_id;
      let name = random.ss.getNodeName();
      let server = random.ss.getNodeServer();
      let description = random.ss.getNodeDescription();
      let method = random.ss.getNodeMethod();
      let is_visible = random.ss.getNodeIsVisible();
      let sort = random.ss.getNodeSort();
      let res = yield api.put(base_path)
        .use(user_plugin.plugin())
        .send({node_id, name, server, description, method, is_visible, sort})
        .expect(200);
      expect(res.body.name).to.equal(name);
      expect(res.body.server).to.equal(server);
      expect(res.body.description).to.equal(description);
      expect(res.body.method).to.equal(method);
      expect(res.body.is_visible).to.equal(is_visible);
      expect(res.body.sort).to.equal(sort);
    });
  });

  describe('delete', function () {
    it('should delete node success', function* () {
      let node_id = node.node_id;
      yield api.delete(base_path)
        .use(user_plugin.plugin())
        .query({node_id})
        .expect(200);
      yield api.delete(base_path)
        .use(user_plugin.plugin())
        .query({node_id})
        .expect(404);
    });
  });
});
