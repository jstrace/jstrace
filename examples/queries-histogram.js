
var histogram = require('histogram');
var clear = require('clear');

var h = {};
var d = [];

exports['query:1:start'] = function(trace){
  h[trace.id] = trace.timestamp;
};

exports['query:1:end'] = function(trace){
  d.push(trace.timestamp - h[trace.id]);
};

setInterval(function(){
  clear();
  console.log();
  console.log(histogram(d));
  // d = []; optionally reset
}, 1000);
