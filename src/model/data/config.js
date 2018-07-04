const { version } = require('../../../package.json')

module.exports = {
  'version': {
    default: version,
    format: String,
    description: '系统版本号（请勿修改）'
  },
  'min-port': {
    default: '50001',
    format: Number,
    description: '最小端口号'
  },
  'max-port': {
    default: '50999',
    format: Number,
    description: '最大端口号'
  },
  'max-downtime': {
    default: '300',
    format: Number,
    description: '服务中断报警阈值（单位：秒）'
  },
  'default-traffic-limit': {
    default: '10240',
    format: Number,
    description: '默认流量限制（单位：MB）'
  },
  'transfer-log-save-days': {
    default: '180',
    format: Number,
    description: '流量日志保留天数'
  }
}
