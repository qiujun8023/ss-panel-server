
const Chance = require('chance')

let chance = new Chance()

module.exports = {
  getUsername () {
    return chance.word({length: 10})
  },

  getNickname () {
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
