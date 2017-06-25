'use strict'

const Chance = require('chance')

let chance = new Chance()

module.exports = {
  getUserId () {
    return chance.word({length: 10})
  },

  getUserName () {
    return chance.word({length: 8})
  },

  getUserPassword () {
    return chance.word({length: 6})
  },

  getNodeName () {
    return chance.word()
  },

  getNodeAvatar () {
    return chance.avatar()
  },

  getNodeServer () {
    return chance.domain()
  },

  getNodeMethod () {
    return chance.word()
  },

  getNodeDescription () {
    return chance.paragraph()
  },

  getNodeSort () {
    return chance.integer({min: 1, max: 999})
  },

  getNodeIsVisible () {
    return chance.bool()
  }
}
