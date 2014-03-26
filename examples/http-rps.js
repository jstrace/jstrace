
/**
 * This example shows how you can perform more
 * complex reporting, in this case charting requests-per-second
 * using jstrace/chart.
 */

var chart = require('chart');
var clear = require('clear');

var data = [];
var n = 0;

exports.local = function(traces){
  traces.on('request:end', function(trace){
    n++
  });
};

setInterval(function(){
  data.push(n);
  n = 0;
  clear();
  console.log(chart(data));
}, 1000);
