const errors = require('../../lib/errors')
const wechat = require('../../lib/wechat')
const userService = require('../../service/user')

module.exports = async (ctx) => {
  let { code, state } = ctx.request.query

  // 获取用户名
  let username
  try {
    username = (await wechat.getUserIdByCodeAsync(code)).UserId
  } catch (err) {
    throw new errors.BadRequest(err.message)
  }

  // 获取姓名
  let nickname
  try {
    nickname = (await wechat.getUserAsync(username)).name
  } catch (err) {
    throw new errors.BadGateway(err.message || '请求微信服务器失败')
  }

  // 获取用户信息
  let user = await userService.getByUserNameAsync(username)
  if (!user) {
    user = await userService.createAsync({ username, nickname })
  } else {
    await userService.updateAsync(user.userId, { username, nickname })
  }

  ctx.session.user = user
  ctx.redirect(state || '/')
}
