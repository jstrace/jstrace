
var m = {};

exports['request:start'] = function(trace){
  var p = m[trace.pid] = m[trace.pid] || {};
  p[trace.id] = p[trace.id] || {};
  p[trace.id] = trace.timestamp;
};

exports['request:end'] = function(trace){
  var start = m[trace.pid][trace.id];
  var d = Date.now() - start;
  console.log('[%s] %s -> %sms', trace.pid, trace.id, d);
};