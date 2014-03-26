
/**
 * Local execution, jstrace detects that we want
 * the "request:*" probes and enables them in the remote(s),
 * sending _all_ their data. Depending on the data size and
 * volumne this can be expensive, however or many cases it is fine.
 */

var m = {};

exports.local = function(traces){
  traces.on('request:*', function(trace){
    switch (trace.name) {
      case 'request:start':
        m[trace.id] = trace.timestamp;
        break;

      case 'request:end':
        var d = Date.now() - m[trace.id];
        console.log('%s -> %sms', trace.id, d);
        break;
    }
  });
};