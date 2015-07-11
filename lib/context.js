'use strict';

var thunkify = require('thunkify');
var glob = require('glob');

// TODO: define useful attrs and methods for common usage
var context = {
  glob: thunkify(glob)
};

module.exports = context;
