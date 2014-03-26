
/**
 * This example illustrates how you can omit .remote
 * entirely, however it may be more expensive to do so.
 *
 * Here we receive the entire several-kb string.
 */

exports.local = function(traces){
  var bytes = require('bytes');
  traces.on('alloc', function(trace){
    console.log('alloc %s', bytes(trace.value.length));
  });
};
