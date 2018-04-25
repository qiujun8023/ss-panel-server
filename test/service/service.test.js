
const expect = require('chai').expect

const {Service} = require('../../service')
const utility = require('../lib/utility')

describe('service/service', () => {
  let user
  let node

  before(async () => {
    user = await utility.createTestUserAsync()
    node = await utility.createTestNodeAsync({isVisible: true})
  })

  after(async () => {
    await utility.removeTestUserAsync(user)
    await utility.removeTestNodeAsync(node)
  })

  describe('findAsync', () => {
    it('should return false if user not found', async () => {
      let tmpServie = await Service.findAsync(-1)
      expect(tmpServie).to.be.false
    })

    it('should return service list success', async () => {
      let services = await Service.findAsync(user.userId)
      expect(services.length >= 1).to.be.true
      expect(services[0].port).to.equal(user.port)
      expect(services[0].password).to.equal(user.password)
      expect(services[0]).to.include.keys(['name', 'avatar', 'server', 'method', 'description'])
    })
  })

  describe('getAsync', () => {
    it('should return false if user not found', async () => {
      let service = await Service.getAsync(-1)
      expect(service).to.be.false
    })

    it('should return false if node not found', async () => {
      let service = await Service.getAsync(user.userId, -1)
      expect(service).to.be.false
    })

    it('should get service success', async () => {
      let service = await Service.getAsync(user.userId, node.nodeId)
      expect(service.port).to.equal(user.port)
      expect(service.password).to.equal(user.password)
      expect(service.server).to.equal(node.server)
      expect(service.method).to.equal(node.method)
    })
  })
})
