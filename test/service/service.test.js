const { expect } = require('chai')

const utils = require('../lib/utils')
const serviceService = require('../../src/service/service')

describe('service/service', () => {
  let user
  let node

  before(async () => {
    user = await utils.createTestUserAsync()
    node = await utils.createTestNodeAsync({isVisible: true})
  })

  after(async () => {
    await utils.removeTestUserAsync(user)
    await utils.removeTestNodeAsync(node)
  })

  describe('findAsync', () => {
    it('should return false if user not found', async () => {
      let tmpServie = await serviceService.findAsync(-1)
      expect(tmpServie).to.equal(false)
    })

    it('should return service list success', async () => {
      let services = await serviceService.findAsync(user.userId)
      expect(services.length >= 1).to.equal(true)
      expect(services[0].port).to.equal(user.port)
      expect(services[0].password).to.equal(user.password)
      expect(services[0]).to.include.keys(['name', 'avatar', 'server', 'method', 'description'])
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
      let service = await serviceService.getAsync(user.userId, node.nodeId)
      expect(service.port).to.equal(user.port)
      expect(service.password).to.equal(user.password)
      expect(service.server).to.equal(node.server)
      expect(service.method).to.equal(node.method)
    })
  })
})
