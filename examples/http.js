
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

// randomized status

var status = [
  200,
  201,
  400,
  404,
  500,
  505
];

// server

var server = http.createServer(function(req, res){
  var id = ++ids;

  trace('request:start', { id: id });
  setTimeout(function(){

    res.statusCode = status[Math.random() * status.length | 0];
    res.end('hello world');
    trace('request:end', { id: id, status: res.statusCode });
  }, Math.random() * 250 | 0);
});

server.listen(3000);

// another just for trace noise

setInterval(function(){
  trace('something');
}, 200);