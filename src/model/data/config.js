const config = require('config')

module.exports = {
  'version': {
    default: config.get('swagger.info.version'),
    format: String,
    isEditable: false,
    description: '系统版本号'
  },
  'min-port': {
    default: '50001',
    format: Number,
    isEditable: true,
    description: '最小端口号'
  },
  'max-port': {
    default: '50999',
    format: Number,
    isEditable: true,
    description: '最大端口号'
  },
  'max-downtime': {
    default: '300',
    format: Number,
    isEditable: true,
    description: '服务中断报警阈值（单位：秒）'
  },
  'default-traffic-limit': {
    default: '10240',
    format: Number,
    isEditable: true,
    description: '默认流量限制（单位：MB）'
  },
  'transfer-log-save-days': {
    default: '180',
    format: Number,
    isEditable: true,
    description: '流量日志保留天数'
  }
}
