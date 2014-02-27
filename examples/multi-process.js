
/**
 * Module dependencies.
 */

var trace = require('..');

// things you can filter by:

console.log('pid: %d', process.pid);
process.title = 'http';

// request id

var ids = 0;

// faux server

setInterval(function(){
  var id = ++ids;

  trace('request:start', { id: id });
  setTimeout(function(){
    trace('request:end', { id: id });
  }, Math.random() * 100);
}, 150);