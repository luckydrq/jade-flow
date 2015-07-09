'use strict';

function Flow(options) {
  if (!(this instanceof Flow)) return new Flow(options);

  options = options || {};

  this.file = options.file;

}
