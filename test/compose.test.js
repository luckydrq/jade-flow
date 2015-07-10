'use strict';

var assert = require('assert');
var co = require('co');
var Task = require('../lib/task');
var compose = require('../lib/compose');
var debug = require('debug')('flow:test:compose');

/**
 * <task1>
 *   <task2>
 *     <task3>
 *     <task4>
 *   <task5>
 * <task6>
 */
var i = 0;
var task1 = new Task({
  name: 'task1',
  attrs: [],
  children: [],
  middleware: function *(next) {
    debug('task1 begin');
    ++i;
    assert(i === 1);
    yield *next;
    ++i;
    assert(i === 12);
    debug('task1 end');
  }
});

var task2 = new Task({
  name: 'task2',
  attrs: [],
  children: [],
  middleware: function *(next) {
    debug('task2 begin');
    ++i;
    assert(i === 2);
    yield *next;
    ++i;
    assert(i === 9);
    debug('task2 end');
  }
});

var task3 = new Task({
  name: 'task3',
  attrs: [],
  children: [],
  middleware: function *(next) {
    debug('task3 begin');
    ++i;
    assert(i === 3);
    yield *next;
    ++i;
    assert(i === 6);
    debug('task3 end');
  }
});

var task4 = new Task({
  name: 'task4',
  attrs: [],
  children: [],
  middleware: function *(next) {
    ++i;
    assert(i === 4);
    debug('task4 begin');
    yield *next;
    ++i;
    assert(i === 5);
    debug('task4 end');
  }
});

var task5 = new Task({
  name: 'task5',
  attrs: [],
  children: [],
  middleware: function *(next) {
    debug('task5 begin');
    ++i;
    assert(i === 7);
    yield *next;
    ++i;
    assert(i === 8);
    debug('task5 end');
  }
});

var task6 = new Task({
  name: 'task6',
  attrs: [],
  children: [],
  middleware: function *(next) {
    debug('task6 begin');
    ++i;
    assert(i === 10);
    yield *next;
    ++i;
    assert(i === 11);
    debug('task6 end');
  }
});

task1.children = [task2, task5];
task2.children = [task3, task4];

describe('compose test', function() {
  it('should work', function(done) {
    var tasks = [task1, task6];
    var mw = compose(tasks);
    co(mw)
    .then(function() {
      done();
    })
    .catch(function(err) {
      done(err);
    });
  });
});
