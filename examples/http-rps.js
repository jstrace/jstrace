
var chart = require('ascii-chart');
var clear = require('clear');

var data = [];
var n = 0;

exports['request:end'] = function(trace){
  n++;
};

setInterval(function(){
  data.push(n);
  n = 0;

  console.log(chart(data));
}, 1000);
