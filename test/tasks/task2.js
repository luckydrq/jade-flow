'use strict';

var debug = require('debug')('flow:test:task2');

module.exports = function *(next){
  this.body = this.body.replace('task1', 'task2');
  debug('task2 begin');
  yield *next;
  debug('task2 end');
};
