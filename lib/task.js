'use strict';

var assert = require('assert');

module.exports = Task;

function Task(options) {
  assert(typeof options === 'object', 'options should be object');
  this.name = options.name;
  this.attrs = options.attrs || [];
  this.children = options.children || [];
  this.middleware = options.middleware || noop;
}

function *noop() {}
