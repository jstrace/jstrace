
var histogram = require('ascii-histogram');
var clear = require('clear');

var m = {};

exports['request:end'] = function(trace){
  m[trace.status] = m[trace.status] || 0;
  m[trace.status]++;
};

setInterval(function(){
  clear();
  console.log();
  console.log(histogram(m, { bar: '=', width: 30 }));
  // m = {}; // optionally clear the bins each tick
}, 1000);
