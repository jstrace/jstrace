
/**
 * Module dependencies.
 */

var http = require('http');
var trace = require('..');

var ids = 0;

var server = http.createServer(function(req, res){
  var id = ++ids;
  console.log('%s %s', req.method, req.url);

  trace('query:1:start', { id: id });
  query1(function(){
    trace('query:1:end', { id: id });

    trace('query:2:start', { id: id });
    query2(function(){
      trace('query:2:end', { id: id });

      res.end('hello world');
    });
  });
});

server.listen(3000);

function query1(fn) {
  setTimeout(fn, Math.random() * 500 | 0);
}

function query2(fn) {
  setTimeout(fn, Math.random() * 200 | 0);
}