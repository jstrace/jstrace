
var m = {};

exports['request:start'] = function(trace){
  m[trace.id] = trace.timestamp;
};

exports['request:end'] = function(trace){
  var d = Date.now() - m[trace.id];
  console.log('%s -> %sms', trace.id, d);
};