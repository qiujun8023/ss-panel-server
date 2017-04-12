'use strict';

const Chance = require('chance');

let chance = new Chance();

module.exports = {
  getSpiderSaveName() {
    return chance.hash();
  },

  getSpiderSavePath(save_name) {
    return '/download/' + save_name;
  },

  getSpiderRequestUrl() {
    return chance.url();
  },

  getSpiderStatus() {
    return chance.pickone(['ADDED', 'DOWNLOADING', 'COMPLETE', 'FAILURE']);
  },
};
