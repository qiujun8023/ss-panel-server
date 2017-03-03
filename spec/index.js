'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const glob = require('glob');
const YAML = require('js-yaml');
const ZSchema = require('z-schema');
const config = require('config');
const schema = require('swagger-schema-official/schema');

const translate = require('../lib/translate');

const CWD = path.join(__dirname, '../..');
const validator = new ZSchema();

let spec = YAML.load(fs.readFileSync(path.join(CWD, 'server/spec/swagger.yaml')));

spec.paths = glob.sync('server/api/**/*.spec.yaml', {cwd: CWD}).reduce((paths, file) => {
  let location = path.join(CWD, file);
  let uri = translate.fromSpec(file);
  let handle = YAML.load(fs.readFileSync(location, 'utf8'));
  paths[uri] = handle;
  return paths;
}, {});

spec.definitions = glob.sync('server/spec/definitions/*.yaml', {cwd: CWD}).reduce((defs, file) => {
  let location = path.join(CWD, file);
  let name = path.parse(file).name;
  defs[name] = YAML.load(fs.readFileSync(location, 'utf8'));
  return defs;
}, {});

// merge config.swagger and swagger.yaml
let host = `${config.host}:${config.port}`;
_.merge(spec, config.swagger, {host});

/**
 * - require responses.default.schema
 * - if security exist, it should be array
 */
let paths = spec.paths;
for (let uri in paths) {
  for (let method in paths[uri]) {
    let operation = paths[uri][method];

    if (operation.security && !_.isArray(operation.security)) {
      throw new Error(`InvalidSchema ${uri}.${method}.security should be array find ${operation.security}`);
    }

    if (!operation.responses.default || !operation.responses.default.schema) {
      throw new Error(`InvalidSchema ${uri}.${method}.responses.default.schema should exist`);
    }
  }
}
let valid = validator.validate(spec, schema);

if (!valid) {
  let validateResult = validator.getLastErrors();
  throw new Error(`InvalidSchema: '${validateResult[0].message}' at ${validateResult[0].path}`);
}

module.exports = spec;
