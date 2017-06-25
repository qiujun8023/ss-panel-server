'use strict'

const _ = require('lodash')
const config = require('config')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const redis = require('../lib/redis')

let store = new RedisStore({
  client: redis,
  prefix: 'session:'
})

let defaultOptions = {
  store,
  proxy: true,
  resave: true,
  saveUninitialized: true
}
let options = _.assign(defaultOptions, config.session)

module.exports = () => session(options)
