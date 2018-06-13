const Sequelize = require('sequelize')

const sequelize = require('../../lib/sequelize')

module.exports = sequelize.define('config', {
  configId: {
    type: Sequelize.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    field: 'id',
    comment: '主键'
  },
  key: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'key',
    comment: '键'
  },
  value: {
    type: Sequelize.TEXT,
    allowNull: false,
    field: 'value',
    comment: '值'
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'description',
    comment: '配置说明'
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
  tableName: 'config',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['key']
    }
  ]
})
