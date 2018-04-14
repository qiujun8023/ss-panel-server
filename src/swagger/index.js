const fs = require('fs')
const path = require('path')

const _ = require('lodash')
const glob = require('glob')
const yaml = require('js-yaml')
const config = require('config')

const BASE_PATH = __dirname

let loadYaml = function (fileName) {
  return yaml.load(fs.readFileSync(fileName, 'utf8'))
}

let loadPaths = function (dirname) {
  // 获取 yaml 文件列表
  let yamls = glob.sync(`${dirname}/**/*.yaml`, {cwd: BASE_PATH})

  // 处理名称并加载 yaml
  let re = RegExp(`^${dirname}(.*?)(/index)?.yaml$`)
  yamls = yamls.reduce((defs, file) => {
    let name = re.exec(file)[1]
    let def = loadYaml(path.join(BASE_PATH, file))
    defs.push({name, def})
    return defs
  }, [])

  // 排序(防止路由出问题、美观)
  yamls.sort((a, b) => {
    return a.name < b.name ? -1 : 1
  })

  // 返回需要的格式
  return yamls.reduce((defs, item) => {
    defs[item.name] = item.def
    return defs
  }, {})
}

let loadDefs = function (dirname) {
  // 获取 yaml 文件列表
  let yamls = glob.sync(`${dirname}/**/*.yaml`, {cwd: BASE_PATH})

  // 处理名称并加载 yaml
  let re = new RegExp(`^${dirname}/(.*?).yaml$`)
  return yamls.reduce((defs, file) => {
    let key = re.exec(file)[1].replace(/\//g, '.')
    let def = loadYaml(path.join(BASE_PATH, file))
    return _.set(defs, key, def)
  }, {})
}

// 加载基本信息
let fullSpec = loadYaml(path.join(BASE_PATH, './base.yaml'))
_.merge(fullSpec, config.swagger)

// 加载路由
fullSpec.paths = loadPaths('paths')

// 加载定义文件
let names = ['models', 'parameters', 'responses']
for (let name of names) {
  fullSpec[name] = loadDefs(name)
}

module.exports = fullSpec
