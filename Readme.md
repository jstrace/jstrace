
# jstrace

  Dynamic JavaScript tracing written in JavaScript, giving you insight into your nodejs live applications.

  Similar to systems like [dtrace](http://dtrace.org/) or [ktap](http://www.ktap.org/), the goal of dynamic tracing is to enable a rich set of debugging information in live processes, often in production in order to help discover the root of an issue. These
  libraries have extremely minimal overhead when disabled, and may be enabled
  externally when needed.

## Installation

 Library:

```
$ npm install jstrace
```

  Client:

```
$ npm install -g jstrace
```

## Features

 - dynamic tracing :)
 - low overhead when disabled
 - flexible scripting capabilities
 - pid and process title filtering
 - multi-process support

## Usage

```

  Usage: jstrace [options] <script>

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -p, --pid <pid>        trace with the given <pid>
    -t, --title <pattern>  trace with title matching <pattern>

```

## Example Implementation

 Support for example you have probes set up to mark the
 start and end of an http request, you may want to quickly
 tap into the process and see which part of the request/response
 cycle is hindering latency.

 This contrived example isn't very exciting, and only shows has two
 probes, but it illustrates the capabilites. We simply mark the start and
 end of the request, as well as providing the request id.

```js
var http = require('http');
var trace = require('jstrace');

var ids = 0;

var server = http.createServer(function(req, res){
  var id = ++ids;

  trace('request:start', { id: id });
  setTimeout(function(){

    res.end('hello world');
    trace('request:end', { id: id });
  }, Math.random() * 250 | 0);
});

server.listen(3000);
```

 The `jstrace(1)` executable accepts a script which must export a function. This function all subscribed traces from the process(es) it is attached to. The `trace` object passed contains the information given to the in-processe `trace()` call, along with additional metadata such as `trace.timestamp`.

 We can use this data to od anything we like, here we're simply mapping the requset ids to output deltas between the two.

```

var m = {};

module.exports = function(trace){
  switch (trace.name) {
    case 'request:start':
      m[trace.id] = trace.timestamp;
      break;

    case 'request:end':
      var d = Date.now() - m[trace.id];
      console.log('%s -> %sms', trace.id, d);
      break;
  }
}
```

## Trace object

TODO: describe

 - `timestamp` timestamp at the time of invocation
 - `title` process title
 - `pid` process id
 - `name` trace name
 - `*` all other properties given

# License

  MIT