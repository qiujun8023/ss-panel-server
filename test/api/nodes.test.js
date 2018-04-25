const _ = require('lodash')
const { expect } = require('chai')

const utils = require('../lib/utils')
const random = require('../lib/random')

describe('/api/nodes', () => {
  let user
  let nodeId

  before(async () => {
    user = await utils.createTestUserAsync({
      isAdmin: true
    })
  })

  after(async () => {
    await utils.removeTestUserAsync(user)
  })

  describe('create', () => {
    it('should create node success', async () => {
      let name = random.getNodeName()
      let avatar = random.getNodeAvatar()
      let server = random.getNodeServer()
      let description = random.getNodeDescription()
      let method = random.getNodeMethod()
      let sort = random.getNodeSort()
      let isVisible = random.getNodeIsVisible()

      let res = await request.post('/api/nodes')
        .use(utils.setUserSession(user))
        .send({
          name,
          avatar,
          server,
          method,
          description,
          sort,
          isVisible
        })
        .expect(201)

      nodeId = res.body.nodeId
      expect(res.body.name).to.equal(name)
      expect(res.body.avatar).to.equal(avatar)
      expect(res.body.server).to.equal(server)
      expect(res.body.method).to.equal(method)
      expect(res.body.description).to.equal(description)
      expect(res.body.sort).to.equal(sort)
      expect(res.body.isVisible).to.equal(isVisible)
    })
  })

  describe('detail', () => {
    it('should return 404 if node not found', async () => {
      await request.get('/api/nodes/0')
        .use(utils.setUserSession(user))
        .expect(404)
    })

    it('should get node detail success', async () => {
      await request.get(`/api/nodes/${nodeId}`)
        .use(utils.setUserSession(user))
        .expect(200)
    })
  })

  describe('update', () => {
    it('should return 404 if node not found', async () => {
      await request.put('/api/nodes/0')
        .use(utils.setUserSession(user))
        .send({})
        .expect(404)
    })

    it('should update node success', async () => {
      let name = random.getNodeName()
      let avatar = random.getNodeAvatar()
      let server = random.getNodeServer()
      let description = random.getNodeDescription()
      let method = random.getNodeMethod()
      let isVisible = random.getNodeIsVisible()
      let sort = random.getNodeSort()

      let res = await request.put(`/api/nodes/${nodeId}`)
        .use(utils.setUserSession(user))
        .send({
          name,
          avatar,
          server,
          method,
          description,
          sort,
          isVisible
        })
        .expect(200)
      expect(res.body.name).to.equal(name)
      expect(res.body.avatar).to.equal(avatar)
      expect(res.body.server).to.equal(server)
      expect(res.body.method).to.equal(method)
      expect(res.body.description).to.equal(description)
      expect(res.body.sort).to.equal(sort)
      expect(res.body.isVisible).to.equal(isVisible)
    })
  })

  describe('list', () => {
    it('should return node list', async () => {
      let res = await request.get('/api/nodes')
        .use(utils.setUserSession(user))
        .expect(200)

      expect(_.map(res.body, 'nodeId')).to.include(nodeId)
    })
  })

  describe('traffic', () => {
    it('should return node traffic', async () => {
      await request.post(`/api/nodes/${nodeId}/traffic`)
        .use(utils.setUserSession(user))
        .send([
          {
            userId: user.userId,
            flowUp: Math.floor(user.trafficLimit / 2),
            flowDown: Math.floor(user.trafficLimit / 2)
          },
          {
            userId: user.userId,
            flowUp: 0,
            flowDown: 0
          }
        ])
        .expect(200)
    })
  })

  describe('users', () => {
    it('should return node users', async () => {
      let res = await request.get(`/api/nodes/${nodeId}/users`)
        .use(utils.setUserSession(user))
        .expect(200)

      for (let item of res.body) {
        if (user.userId === item.userId) {
          expect(item.isLocked).to.equals(true)
        }
      }
    })
  })

  describe('delete', () => {
    it('should delete node success', async () => {
      await request.delete(`/api/nodes/${nodeId}`)
        .use(utils.setUserSession(user))
        .expect(200)

      await request.delete(`/api/nodes/${nodeId}`)
        .use(utils.setUserSession(user))
        .expect(404)
    })
  })
})
