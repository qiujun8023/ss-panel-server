'use strict';

const expect = require('chai').expect;
const moment = require('moment');

const plugins = require('../../lib/test/plugin');
const utility = require('../../lib/test/utility');

let base_path = '/api/wechat/callback';
let user_plugin = plugins.user();
let switch_plugin = plugins.switch();

describe(base_path, function () {
  let user;

  before(function* () {
    user = yield user_plugin.before('birthday');
  });

  after(function* () {
    yield user_plugin.after();
  });

  it('should return empty with invalid content', function* () {
    let res = yield api.post(base_path)
      .use(switch_plugin.plugin({wechat: true}))
      .send({
        FromUserName: user.user_id,
        MsgType: 'event',
        Event: 'click',
        EventKey: 'invalid content',
      })
      .expect(200);
    expect(res.body).to.be.empty;
  });

  it('should return without birth info', function* () {
    let res = yield api.post(base_path)
      .use(switch_plugin.plugin({wechat: true}))
      .send({
        FromUserName: user.user_id,
        MsgType: 'event',
        Event: 'click',
        EventKey: 'recent',
      })
      .expect(200);
    expect(res.body.length).to.be.equal(1);
    expect(res.body[0]).to.include.keys(['picurl', 'title', 'description']);
  });

  it('should return with birth info', function* () {
    let birth1 = yield utility.birthday.createTestBirthAsync(user.user_id);
    let res1 = yield api.post(base_path)
      .use(switch_plugin.plugin({wechat: true}))
      .send({
        FromUserName: user.user_id,
        MsgType: 'event',
        Event: 'click',
        EventKey: 'recent',
      })
      .expect(200);
    expect(res1.body.length).to.be.equal(2);
    expect(res1.body[0]).to.include.keys(['picurl', 'title']);
    expect(res1.body[0]).to.include.keys(['title']);
    let birth2 = yield utility.birthday.createTestBirthAsync(user.user_id, {
      type: 'SOLAR',
      date: moment().format('YYYY-MM-DD'),
    });
    let res2 = yield api.post(base_path)
      .use(switch_plugin.plugin({wechat: true}))
      .send({
        FromUserName: user.user_id,
        MsgType: 'event',
        Event: 'click',
        EventKey: 'recent',
      })
      .expect(200);
    expect(res2.body.length).to.be.equal(3);
    expect(res2.body[0]).to.include.keys(['picurl', 'title']);
    expect(res2.body[0]).to.include.keys(['title']);
    yield utility.birthday.removeTestBirthAsync(birth1);
    yield utility.birthday.removeTestBirthAsync(birth2);
  });
});
