'use strict';

module.exports = function *(next){
  this.body = 'this is task1';
  console.log('task1 begin');
  yield *next;
  console.log('task1 end');
};
