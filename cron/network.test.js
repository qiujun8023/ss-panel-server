'use strict';

const expect = require('chai').expect;

const flow = require('./network')._flow;

describe('server/cron/flow', function () {
  it('should not remind', function* () {
    let res = yield flow(9999999999);
    expect(res).to.be.false;
  });

  it('should use default threshold', function* () {
    let res = yield flow();
    expect(typeof res).to.equal('boolean');
  });

  it('should remind', function* () {
    let res = yield flow(0);
    expect(res).to.be.true;
  });
});
