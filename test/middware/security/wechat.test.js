
const plugins = require('../../lib/plugin')

let userPlugin = plugins.user()
let BASE_PATH = '/api/profile'

describe('middleware/security/wechat', () => {
  before(async () => {
    await userPlugin.before()
  })

  after(async () => {
    await userPlugin.after()
  })

  it('should throw unauthorized error', async () => {
    await request.get(BASE_PATH).expect(401)
  })

  it('should return profile', async () => {
    await request.get(BASE_PATH)
      .use(utils.setUserSession(user))
      .expect(200)
  })
})
