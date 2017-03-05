'use strict';

const utility = require('./utility');
const errors = require('../../lib/errors');

class BasePlugin {
  *before() {}
  *after() {}
}

class UserPlugin extends BasePlugin {
  *before(app, opts) {
    if (!app) {
      throw new errors.SystemError('app can not be empty');
    }
    this.app = app;
    this.user = yield utility[this.app].createTestUserAsync(opts || {});
    return this.user;
  }

  plugin() {
    if (!this.user) {
      throw new errors.SystemError('Plugin should be initialized before use');
    }

    return (req) => {
      req.set('x-user-id', this.user.user_id);
    };
  }

  *after() {
    return yield utility[this.app].removeTestUserAsync(this.user);
  }
}

class SwitchPlugin extends BasePlugin {
  plugin(options) {
    return (req) => {
      req.set('x-switch', JSON.stringify(options));
      return req;
    };
  }
}

let plugins = {
  user: UserPlugin,
  switch: SwitchPlugin,
};

for (let name in plugins) {
  exports[name] = function () {
    return new (plugins[name])();
  };
}
