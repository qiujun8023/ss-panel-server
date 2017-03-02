'use strict';

const errors = require('../../../lib/errors');
const format = require('../../../lib/format').birthday;
const birthday = require('../../../service/birthday');

module.exports = {
  *get(req, res) {
    let user_id = req.session.birthday.user.user_id;
    let setting_id = req.query.setting_id;

    let birth;
    let setting = yield birthday.getSettingAsync(setting_id);
    if (setting) {
      birth = yield birthday.getBirthAsync(setting.birth_id);
    }

    // 存在性及权限判断
    if (!setting || !birth || birth.user_id !== user_id) {
      throw new errors.NotFound('未找到相关提醒');
    }

    res.json(format.setting(setting));
  },
};
