
const { expect } = require('chai')

const utils = require('../lib/utils')
const trafficService = require('../../src/service/traffic')

const FLOW_UP = 4096
const FLOW_DOWN = 4096

describe('service/traffic', () => {
  let user
  let node

  before(async () => {
    user = await utils.createTestUserAsync()
    node = await utils.createTestNodeAsync({ isVisible: true })
  })

  after(async () => {
    await utils.removeTestUserAsync(user)
    await utils.removeTestNodeAsync(node)
  })

  describe('createAsync', () => {
    it('should add traffic log success', async () => {
      await trafficService.createAsync({
        nodeId: node.nodeId,
        userId: user.userId,
        flowUp: FLOW_UP,
        flowDown: FLOW_DOWN
      })
    })
  })

  describe('findStatAsync', () => {
    it('should return transfer stat success', async () => {
      let res = await trafficService.findStatAsync()
      let keys = ['date', 'flowUp', 'flowDown']
      for (let i = 0; i < res.length; i++) {
        expect(res[i]).to.include.keys(keys)
      }
    })
  })

  describe('findActiveUserAsync', () => {
    it('should find node actived user success', async () => {
      let res = await trafficService.findActiveUserAsync(node.nodeId)
      expect(res.length).to.equal(1)
      expect(res[0].username).to.equal(user.username)
    })
  })

  describe('deleteByDayAsync', () => {
    it('should delete log by day success', async () => {
      await trafficService.deleteByDayAsync(99999)
    })
  })
})
