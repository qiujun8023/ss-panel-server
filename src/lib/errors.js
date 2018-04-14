class HttpError extends Error {
  constructor (message, type, extra, status) {
    super(message)

    this.msg = message
    this.type = type
    this.extra = extra || {}
    this.status = status || 500
  }

  toJSON () {
    return {
      msg: this.msg,
      type: this.type,
      status: this.status,
      extra: this.extra
    }
  }
}

class BadRequest extends HttpError {
  constructor (message, type, extra) {
    super(message, type || 'BadRequest', extra, 400)
  }
}

class Unauthorized extends HttpError {
  constructor (message, type, extra) {
    super(message, type || 'Unauthorized', extra, 401)
  }
}

class Forbidden extends HttpError {
  constructor (message, type, extra) {
    super(message, type || 'Forbidden', extra, 403)
  }
}

class NotFound extends HttpError {
  constructor (message, type, extra) {
    super(message, type || 'NotFound', extra, 404)
  }
}

class Conflict extends HttpError {
  constructor (message, type, extra) {
    super(message, type || 'Conflict', extra, 409)
  }
}

class SystemError extends HttpError {
  constructor (message, type, extra) {
    super(message, type || 'SystemError', extra, 500)
  }
}

class BadGateway extends HttpError {
  constructor (message, type, extra) {
    super(message, type || 'BadGateway', extra, 502)
  }
}

module.exports = {
  HttpError,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  SystemError,
  BadGateway
}
