
var m = {};

exports['request:*'] = function(trace){
  switch (trace.name) {
    case 'request:start':
      m[trace.id] = trace.timestamp;
      break;

    case 'request:end':
      var d = Date.now() - m[trace.id];
      console.log('%s -> %sms', trace.id, d);
      break;
  }
};