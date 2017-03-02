'use strict';

const _ = require('lodash');

const errors = require('../../lib/errors');
const format = require('../../lib/format').birthday;
const birthday = require('../../service/birthday');

module.exports = {
  *get(req, res) {
    let user_id = req.session.birthday.user.user_id;
    let birth_id = req.query.birth_id;

    // 判断所有权
    let birth = yield birthday.getBirthAsync(birth_id);
    if (!birth || birth.user_id !== user_id) {
      throw new errors.NotFound('未找到相关生日');
    }

    let result = [];
    let settings = yield birthday.findSettingAsync(birth_id);
    for (let setting of settings) {
      result.push(format.setting(setting));
    }
    res.json(result);
  },

  *put(req, res) {
    let user_id = req.session.birthday.user.user_id;
    let setting_id = req.body.setting_id;
    let data = _.pick(req.body, ['advance', 'time']);

    // 获取设置信息
    let setting = yield birthday.getSettingAsync(setting_id);
    if (!setting) {
      throw new errors.NotFound('未找到相关设置');
    }

    // 获取设置对应的生日
    let birth = yield birthday.getBirthAsync(setting.birth_id);
    if (!birth || birth.user_id !== user_id) {
      throw new errors.NotFound('未找到相关设置');
    }

    // 更新设置
    setting = yield birthday.updateSettingAsync(setting_id, data);
    res.json(format.setting(setting));
  },

  *post(req, res) {
    let user_id = req.session.birthday.user.user_id;
    let birth_id = req.body.birth_id;
    let data = _.pick(req.body, ['advance', 'time']);

    // 判断所有权
    let birth = yield birthday.getBirthAsync(birth_id);
    if (!birth || birth.user_id !== user_id) {
      throw new errors.NotFound('未找到相关生日');
    }

    let setting = yield birthday.addSettingAsync(birth_id, data);
    res.status(201).json(format.setting(setting));
  },

  *delete(req, res) {
    let user_id = req.session.birthday.user.user_id;
    let setting_id = req.query.setting_id;

    // 获取设置信息
    let setting = yield birthday.getSettingAsync(setting_id);
    if (!setting) {
      throw new errors.NotFound('未找到相关设置');
    }

    // 获取设置对应的生日
    let birth = yield birthday.getBirthAsync(setting.birth_id);
    if (!birth || birth.user_id !== user_id) {
      throw new errors.NotFound('未找到相关设置');
    }

    // 删除设置
    yield birthday.removeSettingAsync(setting_id);
    res.json({result: true});
  },
};
