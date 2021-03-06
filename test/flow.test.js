'use strict';

var assert = require('assert');
var path = require('path');
var Flow = require('..');
var debug = require('debug')('flow:test');

describe('flow test', function() {
  it('should work', function() {
    var flow = new Flow({
      file: 'test/flow.jade',
      taskDir: 'test/tasks'
    });

    flow.run()
    .then(function(ctx) {
      debug("context: %o", ctx);
      done();
    })
    .catch(function(err) {
      done(err);
    });
  });
});
