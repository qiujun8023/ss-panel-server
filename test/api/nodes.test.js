'use strict'

const expect = require('chai').expect

const plugins = require('../lib/plugin')
const random = require('../lib/random')

let BASE_PATH = '/api/nodes'
let userPlugin = plugins.user()

describe(BASE_PATH, function () {
  let node
  let nodes

  before(function* () {
    yield userPlugin.before({isAdmin: true})
  })

  after(function* () {
    yield userPlugin.after()
  })

  describe('get', function () {
    it('should return node list', function* () {
      let res = yield api.get(BASE_PATH)
        .use(userPlugin.plugin())
        .expect(200)
      nodes = res.body
    })
  })

  describe('post', function () {
    it('should add node success', function* () {
      let res1 = yield api.post(BASE_PATH)
        .use(userPlugin.plugin())
        .send({
          name: random.getNodeName(),
          avatar: random.getNodeAvatar(),
          server: random.getNodeServer(),
          method: random.getNodeMethod(),
          description: random.getNodeDescription(),
          sort: random.getNodeSort(),
          isVisible: random.getNodeIsVisible()
        })
        .expect(201)
      node = res1.body

      let res2 = yield api.get(BASE_PATH)
        .use(userPlugin.plugin())
        .expect(200)

      expect(res2.body.length - nodes.length).to.equal(1)
    })
  })

  describe('put', function () {
    it('should return error if node not found', function* () {
      yield api.put(BASE_PATH)
        .use(userPlugin.plugin())
        .send({nodeId: -1})
        .expect(404)
    })

    it('should update node success', function* () {
      let nodeId = node.nodeId
      let name = random.getNodeName()
      let server = random.getNodeServer()
      let description = random.getNodeDescription()
      let method = random.getNodeMethod()
      let isVisible = random.getNodeIsVisible()
      let sort = random.getNodeSort()
      let res = yield api.put(BASE_PATH)
        .use(userPlugin.plugin())
        .send({nodeId, name, server, description, method, isVisible, sort})
        .expect(200)
      expect(res.body.name).to.equal(name)
      expect(res.body.server).to.equal(server)
      expect(res.body.description).to.equal(description)
      expect(res.body.method).to.equal(method)
      expect(res.body.isVisible).to.equal(isVisible)
      expect(res.body.sort).to.equal(sort)
    })
  })

  describe('delete', function () {
    it('should delete node success', function* () {
      let nodeId = node.nodeId
      yield api.delete(BASE_PATH)
        .use(userPlugin.plugin())
        .query({nodeId})
        .expect(200)
      yield api.delete(BASE_PATH)
        .use(userPlugin.plugin())
        .query({nodeId})
        .expect(404)
    })
  })
})
