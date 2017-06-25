'use strict'

const utility = require('./utility')
const errors = require('../../lib/errors')

class BasePlugin {
  *before () {}
  *after () {}
}

class UserPlugin extends BasePlugin {
  *before (opts) {
    this.user = yield utility.createTestUserAsync(opts || {})
    return this.user
  }

  plugin () {
    if (!this.user) {
      throw new errors.SystemError('Plugin should be initialized before use')
    }

    return (req) => {
      req.set('x-user-id', this.user.userId)
    }
  }

  *after () {
    return yield utility.removeTestUserAsync(this.user)
  }
}

class SwitchPlugin extends BasePlugin {
  plugin (options) {
    return (req) => {
      req.set('x-switch', JSON.stringify(options))
      return req
    }
  }
}

let plugins = {
  user: UserPlugin,
  switch: SwitchPlugin
}

for (let name in plugins) {
  exports[name] = function () {
    return new (plugins[name])()
  }
}
