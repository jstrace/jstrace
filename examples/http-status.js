
var histogram = require('ascii-histogram');

var m = {};

exports['request:end'] = function(trace){
  m[trace.status] = m[trace.status] || 0;
  m[trace.status]++;
};

setInterval(function(){
  console.log();
  console.log(histogram(m, { bar: '=', width: 30 }));
  m = {};
}, 1000);
