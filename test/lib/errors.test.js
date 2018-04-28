const { expect } = require('chai')

const errors = require('../../src/lib/errors')

describe('lib/errors', () => {
  it('should throw BadRequest error', () => {
    try {
      throw new errors.BadRequest('A BadRequest Error')
    } catch (e) {
      expect(e.type).to.equal('BadRequest')
      expect(e.status).to.equal(400)
    }
  })

  it('should throw Unauthorized error', () => {
    try {
      throw new errors.Unauthorized('A Unauthorized Error')
    } catch (e) {
      expect(e.type).to.equal('Unauthorized')
      expect(e.status).to.equal(401)
    }
  })

  it('should throw Forbidden error', () => {
    try {
      throw new errors.Forbidden('A Forbidden Error')
    } catch (e) {
      expect(e.type).to.equal('Forbidden')
      expect(e.status).to.equal(403)
    }
  })

  it('should throw NotFound error', () => {
    try {
      throw new errors.NotFound('A NotFound Error')
    } catch (e) {
      expect(e.type).to.equal('NotFound')
      expect(e.status).to.equal(404)
    }
  })

  it('should throw Conflict error', () => {
    try {
      throw new errors.Conflict('A Conflict Error')
    } catch (e) {
      expect(e.type).to.equal('Conflict')
      expect(e.status).to.equal(409)
    }
  })

  it('should throw SystemError error', () => {
    try {
      throw new errors.SystemError('A SystemError Error')
    } catch (e) {
      expect(e.type).to.equal('SystemError')
      expect(e.status).to.equal(500)
    }
  })

  it('should throw BadGateway error', () => {
    try {
      throw new errors.BadGateway('A BadGateway Error')
    } catch (e) {
      expect(e.type).to.equal('BadGateway')
      expect(e.status).to.equal(502)
    }
  })
})
