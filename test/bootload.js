'use strict'

const events = require('events')

const supertest = require('supertest')

const createServer = require('../app')

// https://github.com/visionmedia/supertest/issues/307
events.EventEmitter.defaultMaxListeners = Infinity

before(() => {
  return createServer()
    .then((server) => {
      global.api = supertest(server)
    })
})
