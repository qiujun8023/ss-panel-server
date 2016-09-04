// 'use strict';
//
// const upyun = require('../../service/blog');
//
// module.exports = {
//   *get(req, res) {
//     // let tasks = [{
//     //   url: 'https://github.com/qious/blog-hexo/archive/master.zip',
//     //   // url: 'https://github.com/qious/blog-jekyll/archive/gh-pages.zip',
//     //   overwrite: true,
//     //   save_as: '/master.zip',
//     // }];
//     // let result = yield upyun.spiderAsync(tasks, 'http://shard.ngrok.qiujun.me/api/blog/demo');
//
//     let tasks = [{
//       sources: '/master.zip',
//       save_as: '/123',
//     }];
//     let result = yield upyun.depressAsync(tasks, 'http://shard.ngrok.qiujun.me/api/blog/demo');
//     res.send(result);
//   },
//
//   *post(req, res) {
//     console.log(req.body);
//     res.send({result:true});
//   }
// };
