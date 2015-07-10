'use strict';

var assert = require('assert');
var debug = require('debug')('flow:test:task1');

module.exports = function (options){
  assert(options.name === 'task1');
  debug('task1 options: %o', options);

  return function *(next){
    this.body = 'this is task1';
    debug('task1 begin');
    yield *next;
    debug('task1 end');
  };
};
