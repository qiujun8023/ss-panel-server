'use strict';

const _ = require('lodash');
const moment = require('moment');
const filesize = require('filesize');

let ss = module.exports = {};

ss.profile = function (data) {
  let filter = [
    'user_id',
    'port',
    'password',
    'transfer_used',
    'transfer_used_v',
    'transfer_enable',
    'transfer_enable_v',
    'is_admin',
    'is_locked',
  ];

  return _.pick(this.user(data), filter);
};

ss.user = function (data) {
  let filter = [
    'user_id',
    'port',
    'password',
    'flow_up',
    'flow_up_v',
    'flow_down',
    'flow_down_v',
    'transfer_used',
    'transfer_used_v',
    'transfer_enable',
    'transfer_enable_v',
    'is_admin',
    'is_locked',
    'active_at',
    'regist_at',
  ];

  data.transfer_enable_v = filesize(data.transfer_enable);
  data.transfer_used = data.flow_up + data.flow_down;
  data.transfer_used_v = filesize(data.transfer_used);
  data.flow_up_v = filesize(data.flow_up);
  data.flow_down_v = filesize(data.flow_down);
  data.active_at = moment(data.active_at).format('YYYY-MM-DD HH:mm:ss');
  data.regist_at = moment(data.regist_at).format('YYYY-MM-DD HH:mm:ss');

  return _.pick(data, filter);
};

ss.node = function (data) {
  data.created_at = moment(data.created_at).format('YYYY-MM-DD HH:mm:ss');
  data.updated_at = moment(data.updated_at).format('YYYY-MM-DD HH:mm:ss');
  return data;
};
