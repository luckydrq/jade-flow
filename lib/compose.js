'use strict';

var compose = require('koa-compose');
var debug = require('debug')('flow:compose');

/**
 * compose tasks to middleware
 *
 * task:
 * {
 *   name: 'xxx',
 *   attrs: [],
 *   children: [],
 *   middleware: function *(){}
 * }
 *
 * @param {Array} tasks
 * @api public
 */
module.exports = function (tasks){
  var middleware = [];
  tasks.forEach(function(task) {
    middleware.push(composeMiddleware(task));
  });

  debug(middleware);

  if (middleware.length === 0) {
    return noop;
  } else {
    return compose(middleware);
  }
};

function composeMiddleware(task) {
  var children = task.children || [];
  if (children.length === 0) {
    return task.middleware;
  } else {
    var middleware = [];
    children.forEach(function(t) {
      middleware.push(composeMiddleware(t));
    });
    var mw = task.middleware;
    var mw2 = compose(middleware);

    return function *(next){
      var gen2 = mw2.call(this);
      var gen = mw.call(this, generator.call(this));
      yield *gen;

      function *generator() {
        yield *gen2;
        yield *next;
      }
    };
  }
}

function *noop() {}
