const userService = require('../service/user')

module.exports = async () => {
  return userService.initTrafficAsync()
}
