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

function Flow(options) {
  if (!(this instanceof Flow)) return new Flow(options);

  options = options || {};

  this.file = options.file;
  this.encoding = options.encoding || 'utf8';
  this.taskDir = options.taskDir || path.join(process.cwd(), 'tasks');
  this.tasks = [];
  this.inited = false;

  this.init();
}

Flow.prototype.init = function init() {
  if (this.inited) return;

  this.buildTasks();
  this.inited = true;
};

Flow.prototype.buildTasks = function buildTasks() {
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

  this.tasks = this.loadTasks(ast);

  debug('tasks: %s', JSON.stringify(this.tasks, null, '  '));
};

Flow.prototype.loadTasks = function loadTasks(ast) {
  var self = this;
  var taskDir = this.taskDir;
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
      task.children = self.loadTasks(node.block);
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
        var value = curr.val;
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

Flow.prototype.toMiddleware = function toMiddleware() {
  if (!this.inited) {
    this.init();
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
}
