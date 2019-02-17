const _ = require('lodash')

const errors = require('../../lib/errors')
const configService = require('../../service/config')

module.exports = async (ctx) => {
  let { configId } = ctx.params
  let data = _.pick(ctx.request.body, ['value'])

  // 获取节点信息
  let config = await configService.getAsync(configId)
  if (!config) {
    throw new errors.NotFound('未找到相关配置')
  } else if (!config.isEditable) {
    throw new errors.Forbidden('此配置不允许修改')
  }

  ctx.body = await configService.updateAsync(configId, data)

  // 刷新缓存
  await configService.refreshAsync()
}
