'use strict';

const expect = require('chai').expect;

const ss = require('./ss');
const utility = require('../lib/test/utility');
const random = require('../lib/test/random');

describe('server/service/ss', function () {
  let user;
  let node;

  describe('randUniquePort', function () {
    it('should throw error when no port is free', function () {
      expect(function () {
        ss.randUniquePort([1, 2, 3], 1, 3);
      }).to.throw();
    });
  });

  describe('createUserAsync', function () {
    it('should add user success', function* () {
      user = yield utility.ss.createTestUserAsync();
      expect(user).to.include.keys(['user_id', 'name', 'port', 'password']);
    });
  });

  describe('getUserAsync', function () {
    it('should return false if user not found', function* () {
      let tmp_user = yield ss.getUserAsync('invalid user');
      expect(tmp_user).to.be.false;
    });

    it('should get user success', function* () {
      let tmp_user = yield ss.getUserAsync(user.user_id);
      expect(tmp_user.name).to.equal(user.name);
    });
  });

  describe('findUserAsync', function () {
    it('should return user list success', function* () {
      let users = yield ss.findUserAsync(user.user_id);
      expect(users.length >= 1).to.be.true;
      expect(users[0]).to.include.keys(['user_id', 'name', 'port', 'password']);
    });
  });

  describe('updateUserAsync', function () {
    it('should return false if user not found', function* () {
      let tmp_user = yield ss.updateUserAsync(-1);
      expect(tmp_user).to.be.false;
    });

    it('should update user success', function* () {
      let name = random.ss.getUserName();
      let tmp_user = yield ss.updateUserAsync(user.user_id, {name});
      expect(tmp_user.name).to.equal(name);
      user.name = name;
    });
  });

  describe('addNodeAsync', function () {
    it('should add node success', function* () {
      node = yield utility.ss.createTestNodeAsync({is_visible: true});
      expect(node).to.include.keys(['name', 'avatar', 'server', 'method', 'description', 'sort', 'is_visible']);
    });
  });

  describe('getNodeAsync', function () {
    it('should return false if node not found', function* () {
      let tmp_node = yield ss.getNodeAsync(-1);
      expect(tmp_node).to.be.false;
    });

    it('should get node success', function* () {
      let tmp_node = yield ss.getNodeAsync(node.node_id);
      expect(tmp_node.name).to.equal(node.name);
      expect(tmp_node.description).to.equal(node.description);
      expect(tmp_node.is_visible).to.equal(node.is_visible);
    });
  });

  describe('findNodeAsync', function () {
    it('should return node list success', function* () {
      let nodes = yield ss.findNodeAsync();
      expect(nodes.length >= 1).to.be.true;
      expect(nodes[0]).to.include.keys(['name', 'avatar', 'server', 'method', 'description', 'sort', 'is_visible']);
    });
  });

  describe('updateNodeAsync', function () {
    it('should return false if node not found', function* () {
      let tmp_node = yield ss.updateNodeAsync(-1);
      expect(tmp_node).to.be.false;
    });

    it('should update node success', function* () {
      let name = random.ss.getNodeName();
      let tmp_node = yield ss.updateNodeAsync(node.node_id, {name});
      expect(tmp_node.name).to.equal(name);
      node.name = name;
    });
  });

  describe('findServiceAsync', function () {
    it('should return false if user not found', function* () {
      let tmp_user = yield ss.findServiceAsync(-1);
      expect(tmp_user).to.be.false;
    });

    it('should return service list success', function* () {
      let services = yield ss.findServiceAsync(user.user_id);
      expect(services.length >= 1).to.be.true;
      expect(services[0].port).to.equal(user.port);
      expect(services[0].password).to.equal(user.password);
      expect(services[0]).to.include.keys(['name', 'avatar', 'server', 'method', 'description']);
    });
  });

  describe('getServiceAsync', function () {
    it('should return false if user not found', function* () {
      let service = yield ss.getServiceAsync(-1);
      expect(service).to.be.false;
    });

    it('should return false if node not found', function* () {
      let service = yield ss.getServiceAsync(user.user_id, -1);
      expect(service).to.be.false;
    });

    it('should get service success', function* () {
      let service = yield ss.getServiceAsync(user.user_id, node.node_id);
      expect(service.port).to.equal(user.port);
      expect(service.password).to.equal(user.password);
      expect(service.server).to.equal(node.server);
      expect(service.method).to.equal(node.method);
    });
  });

  describe('removeNodeAsync', function () {
    it('should return false if node not found', function* () {
      let tmp_node = yield ss.removeNodeAsync(-1);
      expect(tmp_node).to.be.false;
    });

    it('should remove node success', function* () {
      yield utility.ss.removeTestNodeAsync(node);
      let tmp_node = yield ss.getNodeAsync(node.node_id);
      expect(tmp_node).to.be.false;
    });
  });

  describe('removeUserAsync', function () {
    it('should return false if user not found', function* () {
      let tmp_user = yield ss.removeUserAsync(-1);
      expect(tmp_user).to.be.false;
    });

    it('should remove user success', function* () {
      yield utility.ss.removeTestUserAsync(user);
      let tmp_user = yield ss.getUserAsync(user.user_id);
      expect(tmp_user).to.be.false;
    });
  });

  describe('findOfferAsync', function () {
    it('should return service list success', function* () {
      yield ss.findOfferAsync();
    });
  });
});
