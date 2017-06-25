'use strict'

const sway = require('sway')

const spec = require('../spec')

module.exports = function () {
  return sway.create({definition: spec})
}
