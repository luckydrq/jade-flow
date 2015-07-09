'use strict';

var assert = require('assert');
var path = require('path');
var Flow = require('..');

describe('flow test', function() {
  it('should work', function() {
    var flow = new Flow({
      file: path.join(__dirname, 'flow.jade'),
      taskDir: path.join(__dirname, 'tasks')
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
