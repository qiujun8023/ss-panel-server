const { expect } = require('chai')

const utils = require('../lib/utils')
const serviceService = require('../../src/service/service')

describe('service/service', () => {
  let user
  let node1
  let node2

  before(async () => {
    user = await utils.createTestUserAsync()
    node1 = await utils.createTestNodeAsync({ isVisible: true })
    node2 = await utils.createTestNodeAsync({ isVisible: false })
  })

  after(async () => {
    await utils.removeTestUserAsync(user)
    await utils.removeTestNodeAsync(node1)
    await utils.removeTestNodeAsync(node2)
  })

  describe('findAsync', () => {
    it('should return false if user not found', async () => {
      let tmpServie = await serviceService.findAsync(-1)
      expect(tmpServie).to.equal(false)
    })

    it('should return service list success', async () => {
      let services = await serviceService.findAsync(user.userId)
      expect(services.length >= 1).to.equal(true)
      let keys = ['name', 'avatar', 'server', 'port', 'method', 'password', 'description']
      for (let service of services) {
        expect(service.port).to.equal(user.port)
        expect(service.password).to.equal(user.password)
        expect(service).to.include.keys(keys)
      }
    })
  })

  describe('getAsync', () => {
    it('should return false if user not found', async () => {
      let service = await serviceService.getAsync(-1)
      expect(service).to.equal(false)
    })

    it('should return false if node not found', async () => {
      let service = await serviceService.getAsync(user.userId, -1)
      expect(service).to.equal(false)
    })

    it('should get service success', async () => {
      let service = await serviceService.getAsync(user.userId, node1.nodeId)
      expect(service.port).to.equal(user.port)
      expect(service.password).to.equal(user.password)
      expect(service.server).to.equal(node1.server)
      expect(service.method).to.equal(node1.method)
    })
  })
})
