
/**
 * This example shows how you can map on the .pid to
 * report on multiple processes, or an entire cluster
 * in real-time.
 */

var m = {};

exports.local = function(traces){
  traces.on('request:start', function(trace){
    var p = m[trace.pid] = m[trace.pid] || {};
    p[trace.id] = p[trace.id] || {};
    p[trace.id] = trace.timestamp;
  });

  traces.on('request:end', function(trace){
    var start = m[trace.pid][trace.id];
    var d = Date.now() - start;
    console.log('[%s] %s -> %sms', trace.pid, trace.id, d);
  });
};
