
/**
 * Module dependencies.
 */

var http = require('http');
var trace = require('..');

// things you can filter by:

console.log('pid: %d', process.pid);
process.title = 'http';

// request id

var ids = 0;

// server

var server = http.createServer(function(req, res){
  var id = ++ids;

  trace('request:start', { id: id });
  setTimeout(function(){

    res.end('hello world');
    trace('request:end', { id: id });
  }, Math.random() * 250 | 0);
});

server.listen(3000);

// another just for trace noise

setInterval(function(){
  trace('something');
}, 200);