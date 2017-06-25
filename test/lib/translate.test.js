'use strict'

const path = require('path')

const expect = require('chai').expect

const translate = require('../../lib/translate')

const DEST = process.cwd()

describe('lib/translate', function () {
  describe('from', function () {
    it('code', function () {
      let from = 'server/api/demo/hello.code.js'
      let res = translate.fromCode(from)
      expect(res).to.equal('/api/demo/hello')
    })

    it('test', function () {
      let from = 'server/api/demo/hello.test.js'
      let res = translate.fromCode(from)
      expect(res).to.equal('/api/demo/hello')
    })

    it('spec', function () {
      let from = 'server/api/demo/hello.spec.js'
      let res = translate.fromCode(from)
      expect(res).to.equal('/api/demo/hello')
    })
  })

  describe('to', function () {
    it('code', function () {
      let to = '/api/demo/hello'
      let res = translate.toCode(to)
      expect(res).to.equal(path.join(DEST, to + '.code.js'))
    })

    it('test', function () {
      let to = '/api/demo/hello'
      let res = translate.toTest(to)
      expect(res).to.equal(path.join(DEST, to + '.test.js'))
    })

    it('spec', function () {
      let to = '/api/demo/hello'
      let res = translate.toSpec(to)
      expect(res).to.equal(path.join(DEST, to + '.spec.yaml'))
    })
  })

  describe('is', function () {
    it('code', function () {
      let is = '/api/demo/hello.code.js'
      let res = translate.isCode(is)
      expect(res).to.be.true
    })

    it('not test', function () {
      let is = '/api/demo/hello.spec.yaml'
      let res = translate.isTest(is)
      expect(res).to.be.false
    })

    it('spec', function () {
      let is = '/api/demo/hello.spec.yaml'
      let res = translate.isSpec(is)
      expect(res).to.be.true
    })
  })
})
