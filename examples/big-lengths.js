
/**
 * This example illustrates how we can utilize
 * remote execution to drastically improve trace
 * performance.
 */

/**
 * Remote: send lengths
 */

exports.remote = function(traces){
  traces.on('alloc', function(trace){
    traces.emit('alloc length', trace.value.length);
  });
};

/**
 * Local: display lengths
 */

exports.local = function(traces){
  var bytes = require('bytes');
  traces.on('alloc length', function(len){
    console.log('alloc %s', bytes(len));
  });
};
