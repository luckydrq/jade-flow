'use strict';

var assert = require('assert');
var Flow = require('..');

describe('context test', function() {
  it('this.glob should work', function(done) {
    var flow = new Flow({
      file: 'test/context.jade',
      taskDir: 'test/tasks'
    });

    flow.run()
    .then(function() {
      done();
    })
    .catch(function(err) {
      done(err);
    });
  });
});
