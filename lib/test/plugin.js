'use strict';

const utility = require('./utility');

class BasePlugin {
  *before() {}
  *after() {}
}

class UserPlugin extends BasePlugin {
  *before(item) {
    if (!item) {
      throw new Error('item can not be empty');
    }
    this.item = item;
    this.user = yield utility[this.item].createTestUserAsync();
    return this.user;
  }

  plugin() {
    if (!this.user) {
      throw new Error('Plugin should be initialized before use');
    }

    return (req) => {
      req.set('x-item', this.item);
      req.set('x-user-id', this.user.user_id);
    };
  }

  *after() {
    return yield utility[this.item].removeTestUserAsync(this.user);
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
