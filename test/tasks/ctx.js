'use strict';

var path = require('path');
var assert = require('assert');
var debug = require('debug')('flow:test:ctx');

module.exports = function(options) {
  debug(options);

  return function *(next) {
    var src = options.src;
    var files = yield this.glob(path.join(process.cwd(), src));
    debug(files);
    assert(files.length === 1);
    assert(~files[0].indexOf('context.test.js'));
    yield *next;
  };
};
