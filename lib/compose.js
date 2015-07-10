'use strict';

var compose = require('koa-compose');
var debug = require('debug')('flow:compose');

/**
 * @param {Array} tasks
 *
 * task:
 * {
 *   name: 'xxx',
 *   attrs: [],
 *   children: [],
 *   middleware: function *(){}
 * }
 */
module.exports = function (tasks){
  var middleware = [];
  tasks.forEach(function(task) {
    middleware.push(composeMiddleware(task));
  });

  debug(middleware);

  return compose(middleware);
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
