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
  var middleware = [];
  middleware.push(task.middleware);

  var children = task.children || [];
  if (children.length === 0) {
    return compose(middleware);
  } else {
    children.forEach(function(t) {
      middleware.push(composeMiddleware(t));
    });
    var mw = compose(middleware);
    return function *(next){
      var gen = mw.call(this);
      yield *gen;
      yield *next;
    };
  }
}
