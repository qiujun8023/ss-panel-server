'use strict';

module.exports = function () {
  return function (req, res, next) {
    req.session.user = {user_id: '1305010119'};
    next();
  };
};
