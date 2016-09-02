'use strict';

const events = require('events');

const supertest = require('supertest');

const app = require('../app');

// https://github.com/visionmedia/supertest/issues/307
events.EventEmitter.defaultMaxListeners = Infinity;

global.api = supertest(app);
