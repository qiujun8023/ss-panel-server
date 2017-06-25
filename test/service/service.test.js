'use strict'

const expect = require('chai').expect

const {Service} = require('../../service')
const utility = require('../lib/utility')

describe('service/service', function () {
  let user
  let node

  before(function* () {
    user = yield utility.createTestUserAsync()
    node = yield utility.createTestNodeAsync()
  })

  after(function* () {
    yield utility.removeTestUserAsync(user)
    yield utility.removeTestNodeAsync(node)
  })

  describe('findAsync', function () {
    it('should return false if user not found', function* () {
      let tmpServie = yield Service.findAsync(-1)
      expect(tmpServie).to.be.false
    })

    it('should return service list success', function* () {
      let services = yield Service.findAsync(user.userId)
      expect(services.length >= 1).to.be.true
      expect(services[0].port).to.equal(user.port)
      expect(services[0].password).to.equal(user.password)
      expect(services[0]).to.include.keys(['name', 'avatar', 'server', 'method', 'description'])
    })
  })

  describe('getServiceAsync', function () {
    it('should return false if user not found', function* () {
      let service = yield Service.getAsync(-1)
      expect(service).to.be.false
    })

    it('should return false if node not found', function* () {
      let service = yield Service.getAsync(user.userId, -1)
      expect(service).to.be.false
    })

    it('should get service success', function* () {
      let service = yield Service.getAsync(user.userId, node.nodeId)
      expect(service.port).to.equal(user.port)
      expect(service.password).to.equal(user.password)
      expect(service.server).to.equal(node.server)
      expect(service.method).to.equal(node.method)
    })
  })
})
