'use strict'

/**
 * This module transform between local file location and API URI.
 */
const path = require('path')

const DEST = process.cwd()
const DEST_PREFIX = 'server'

// '/api/demo/hello' => '${DEST}/api/demo/hello${suffix}'
function to (suffix, uri, dest) {
  dest = dest || DEST
  const pathObj = path.parse(path.join(dest, uri))
  return path.join(pathObj.dir, pathObj.base + suffix)
}

// 'server/api/demo/hello${suffix}' => '/api/demo/hello'
function from (suffix, location, destPrefix) {
  destPrefix = destPrefix || DEST_PREFIX
  return location.slice(destPrefix.length, -suffix.length)
}

function is (suffix, location) {
  const index = location.indexOf(suffix)
  if (index === -1) {
    return false
  }

  return index === (location.length - suffix.length)
}

const SUFFIX_CODE = '.code.js'
const SUFFIX_TEST = '.test.js'
const SUFFIX_SPEC = '.spec.yaml'

module.exports = {
  // '/api/demo/hello' => 'server/api/demo/hello.code.js'
  toCode: to.bind(null, SUFFIX_CODE),
  // '/api/demo/hello' => 'server/api/demo/hello.test.js'
  toTest: to.bind(null, SUFFIX_TEST),
  // '/api/demo/hello' => 'server/api/demo/hello.spec.yaml'
  toSpec: to.bind(null, SUFFIX_SPEC),

  // 'server/api/demo/hello.code.js' => '/api/demo/hello'
  fromCode: from.bind(null, SUFFIX_CODE),
  // 'server/api/demo/hello.test.js' => '/api/demo/hello'
  fromTest: from.bind(null, SUFFIX_TEST),
  // 'server/api/demo/hello.spec.yaml' => '/api/demo/hello'
  fromSpec: from.bind(null, SUFFIX_SPEC),

  isCode: is.bind(null, SUFFIX_CODE),
  isTest: is.bind(null, SUFFIX_TEST),
  isSpec: is.bind(null, SUFFIX_SPEC)
}
