const errors = require('../../lib/errors')
const wechat = require('../../lib/wechat')
const userService = require('../../service/user')

module.exports = async (ctx) => {
  let { code, state } = req.query

  // 获取用户 ID
  let userId
  try {
    userId = (await wechat.getUserIdByCodeAsync(code)).UserId
  } catch (err) {
    throw new errors.BadRequest(err.message)
  }

  // 获取姓名
  let name
  try {
    name = (await wechat.getUserAsync(userId)).name
  } catch (err) {
    throw new errors.BadGateway(err.message || '请求微信服务器失败')
  }

  // 获取用户信息
  let user = await userService.getAsync(userId)
  if (!user) {
    user = await userService.createAsync({ userId, name })
  } else {
    await userService.updateAsync(userId, { name })
  }

  req.session.user = user
  res.redirect(state || '/')
}
