'use strict';

const config = require('config');

module.exports = function () {
  return function (req, res, next) {
    let switchs = {};
    if (config.env === 'test') {
      switchs = JSON.parse(req.get('x-switch') || '{}');
    }

    req.isSwitchOff = (feature) => {
      return switchs[feature] !== undefined && switchs[feature] === false;
    };

    req.isSwitchOn = (feature) => {
      return switchs[feature] !== undefined && switchs[feature] === true;
    };

    next();
  };
};
