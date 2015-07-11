'use strict';

var assert = require('assert');

module.exports = Task;

/**
 * Task
 *
 * @param {Object}
 * @api public
 */
function Task(options) {
  assert(typeof options === 'object', 'options should be object');
  this.name = options.name;
  this.attrs = options.attrs || [];
  this.children = options.children || [];
  this.middleware = options.middleware || noop;
}

function *noop() {}
