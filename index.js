'use strict';

var path = require('path');
var fs = require('fs');
var co = require('co');
var compose = require('./lib/compose');
var Task = require('./lib/task');
var context = require('./lib/context');
var format = require('util').format;
var lexer = require('jade-lexer');
var parse = require('jade-parser');
var debug = require('debug')('flow');
var isAbsolute = require('node-path-extras').isAbsolute;

module.exports = Flow;

/**
 * Initialize a control flow
 *
 * @param {Object}
 * @return {Flow}
 * @api public
 */
function Flow(options) {
  if (!(this instanceof Flow)) return new Flow(options);

  options = options || {};

  this.file = options.file;
  this.encoding = options.encoding || 'utf8';
  this.taskDir = options.taskDir || path.join(process.cwd(), 'tasks');
  this.tasks = [];
  this.inited = false;

  this._init();
}

/**
 * init flow
 *
 * @api private
 */
Flow.prototype._init = function _init() {
  if (this.inited) return;

  this._buildTasks();
  this.inited = true;
};

/**
 * @api private
 */
Flow.prototype._buildTasks = function _buildTasks() {
  var file = this.file;
  if (!isAbsolute(file)) {
    file = path.join(process.cwd(), file);
  }

  if (!fs.existsSync(file)) {
    throw new Error(format('can not find file: %s', file));
  }

  var filename = path.basename(file);
  var tokens = lexer(fs.readFileSync(file, { encoding: this.encoding }), filename);
  var ast = parse(tokens, filename);

  this.tasks = this._loadTasks(ast);

  debug('tasks: %s', JSON.stringify(this.tasks, null, '  '));
};

/**
 * @api private
 */
Flow.prototype._loadTasks = function _loadTasks(ast) {
  var self = this;
  var taskDir = this.taskDir;
  if (!isAbsolute(taskDir)) {
    taskDir = path.join(process.cwd(), taskDir);
  }
  var tasks = [];
  var nodes = ast.nodes.filter(function(node) {
    return node.type === 'Tag';
  });

  nodes.forEach(function(node) {
    var task = new Task({
      name: node.name,
      attrs: node.attrs
    });
    if (node.block) {
      task.children = self._loadTasks(node.block);
    }

    // load middleware
    var middleware;
    try {
      // 先从taskDir里找，找不到再从node_modules里找
      middleware = require(path.join(taskDir, task.name));
    } catch(e) {
      middleware = require(task.name);
    }
    if (isFunction(middleware) && !isGeneratorFunction(middleware)) {
      middleware = middleware.call(null, task.attrs.reduce(function(prev, curr) {
        var key = curr.name;
        var value = replaceQuote(curr.val);
        prev[key] = value;
        return prev;
      }, {}));
    }
    if (!isGeneratorFunction(middleware)) {
      throw new Error(format('task %s: middleware is not a generator function', task.name));
    }
    task.middleware = middleware;
    tasks.push(task);
  });

  return tasks;
};

/**
 * start running
 *
 * @param {Object}
 * @return {Promise}
 * @api public
 */
Flow.prototype.run = function run(ctx) {
  debug('this.tasks.length: %d', this.tasks.length);

  if (!this.tasks || this.tasks.length === 0) {
    return Promise.resolve();
  }

  ctx = createContext(ctx);

  return co.call(ctx, compose(this.tasks))
    .then(function() {
      return Promise.resolve(ctx);
    });
};

/**
 * convert the flow to a middleware
 *
 * @return {GeneratorFunction}
 * @api public
 *
 */
Flow.prototype.toMiddleware = function toMiddleware() {
  if (!this.inited) {
    this._init();
  }
  return compose(this.tasks);
};

function isFunction(fn) {
  return typeof fn === 'function';
}

function isGeneratorFunction(fn) {
  return isFunction(fn) && fn.constructor.name === 'GeneratorFunction';
}

function createContext(ctx) {
  ctx = ctx || {};

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ctx, context);
  } else {
    ctx.__proto__ = context;
  }

  return ctx;
}

function replaceQuote(val) {
  return val.replace(/^(['"])(.*)\1$/, '$2');
}
