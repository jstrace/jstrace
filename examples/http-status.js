
var m = {};

exports['request:end'] = function(trace){
  m[trace.status] = m[trace.status] || 0;
  m[trace.status]++;
};

setInterval(function(){
  histogram(m);
  m = {};
}, 5000);

/**
 * Output histogram.
 */

function histogram(data) {
  var width = 60;

  data = Object.keys(data).map(function(key){
    return {
      key: key,
      val: data[key]
    }
  });

  data = data.sort(function(a, b){
    return b.val - a.val;
  });

  var m = max(data);

  console.log();

  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var p = d.val / m;
    var shown = Math.round(width * p);
    var blank = width - shown
    var bar = Array(shown).join('#');
    bar += Array(blank).join(' ');
    console.log('  %s | %s | %s', d.key, bar, d.val);
  }

  console.log();
}

/**
 * Max in `data`.
 */

function max(data) {
  var n = data[0].val;

  for (var i = 1; i < data.length; i++) {
    n = data[i].val > n ? data[i].val : n;
  }

  return n;
}