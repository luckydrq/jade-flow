'use strict';

var assert = require('assert');
var co = require('co');
var Task = require('../lib/task');
var compose = require('../lib/compose');

/**
 * <task1>
 *   <task2>
 *     <task3>
 *     <task4>
 *   <task5>
 * <task6>
 */
var task1 = new Task({
  name: 'task1',
  attrs: {},
  children: [],
  middleware: function *(next) {
    console.log('task1 begin');
    yield *next;
    console.log('task1 end');
  }
});

var task2 = new Task({
  name: 'task2',
  attrs: {},
  children: [],
  middleware: function *(next) {
    console.log('task2 begin');
    yield *next;
    console.log('task2 end');
  }
});

var task3 = new Task({
  name: 'task3',
  attrs: {},
  children: [],
  middleware: function *(next) {
    console.log('task3 begin');
    yield *next;
    console.log('task3 end');
  }
});

var task4 = new Task({
  name: 'task4',
  attrs: {},
  children: [],
  middleware: function *(next) {
    console.log('task4 begin');
    yield *next;
    console.log('task4 end');
  }
});

var task5 = new Task({
  name: 'task5',
  attrs: {},
  children: [],
  middleware: function *(next) {
    console.log('task5 begin');
    yield *next;
    console.log('task5 end');
  }
});

var task6 = new Task({
  name: 'task6',
  attrs: {},
  children: [],
  middleware: function *(next) {
    console.log('task6 begin');
    yield *next;
    console.log('task6 end');
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
