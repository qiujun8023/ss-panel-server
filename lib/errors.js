'use strict';

class HttpError extends Error {
  constructor(message, type, status) {
    super(message);

    this.type = type;
    this.status = status || 500;
  }
}

class BadRequest extends HttpError {
  constructor(message, type) {
    super(message, type || 'BadRequest', 400);
  }
}

class Unauthorized extends HttpError {
  constructor(message, type) {
    super(message, type || 'Unauthorized', 401);
  }
}

class Forbidden extends HttpError {
  constructor(message, type) {
    super(message, type || 'Forbidden', 403);
  }
}

class NotFound extends HttpError {
  constructor(message, type) {
    super(message, type || 'NotFound', 404);
  }
}

class Conflict extends HttpError {
  constructor(message, type) {
    super(message, type || 'Conflict', 409);
  }
}

class SystemError extends HttpError {
  constructor(message, type) {
    super(message, type || 'SystemError', 500);
  }
}

class BadGateway extends HttpError {
  constructor(message, type) {
    super(message, type || 'BadGateway', 502);
  }
}

module.exports = {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  SystemError,
  BadGateway,
};
