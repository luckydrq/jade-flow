'use strict';

module.exports = function *(next){
  this.body = this.body.replace('task1', 'task2');
  console.log('task2 begin');
  yield *next;
  console.log('task2 end');
};
