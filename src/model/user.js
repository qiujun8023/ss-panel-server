
const Sequelize = require('sequelize')

const sequelize = require('../lib/sequelize')

module.exports = sequelize.define('user', {
  userId: {
    type: Sequelize.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    field: 'id',
    comment: '用户 Id'
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'username',
    comment: '用户唯一标识'
  },
  nickname: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'nickname',
    comment: '昵称'
  },
  port: {
    type: Sequelize.INTEGER,
    allowNull: false,
    field: 'port',
    comment: 'SS 端口'
  },
  password: {
    type: Sequelize.STRING(32),
    allowNull: false,
    field: 'password',
    comment: 'SS 密码'
  },
  flowUp: {
    type: Sequelize.BIGINT,
    allowNull: false,
    defaultValue: 0,
    field: 'flow_up',
    comment: '上传流量'
  },
  flowDown: {
    type: Sequelize.BIGINT,
    allowNull: false,
    defaultValue: 0,
    field: 'flow_down',
    comment: '下载流量'
  },
  trafficLimit: {
    type: Sequelize.BIGINT,
    allowNull: false,
    field: 'traffic_limit',
    comment: '总流量'
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    field: 'is_admin',
    comment: '是否管理员'
  },
  isLocked: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    field: 'is_locked',
    comment: '是否禁用'
  },
  activedAt: {
    type: Sequelize.DATE,
    allowNull: true,
    field: 'actived_at',
    comment: '用户最后活跃时间'
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    field: 'created_at',
    comment: '创建时间'
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    field: 'updated_at',
    comment: '更新时间'
  }
}, {
  tableName: 'user',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['username']
    },
    {
      unique: true,
      fields: ['port']
    }
  ]
})
