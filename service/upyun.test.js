'use strict';

const expect = require('chai').expect;

const upyun = require('./upyun');

describe('server/service/upyun', function () {
  it('sortFile', function () {
    let files = upyun.sortFile([
      {
        type: 'F',
        name: '1',
      }, {
        type: 'N',
        name: '1',
      }, {
        type: 'F',
        name: '2',
      }, {
        type: 'N',
        name: '2',
      },
    ]);
    expect(files[0].type).to.equal('F');
    expect(files[0].name).to.equal('1');
    expect(files[3].type).to.equal('N');
    expect(files[3].name).to.equal('2');
  });

  it('formatFile', function () {
    let files = upyun.formatFile([{
      size: '0',
      time: '1482908372',
    }]);
    expect(files[0]).to.include.keys(['size_v', 'time_v']);
  });
});
