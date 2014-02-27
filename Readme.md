
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

## Example

### Instrumentation

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

### Analysis

 The `jstrace(1)` executable accepts a script which exports functions with trace patterns
 to match. These function names tell jstrace which traces to subscribe to. The `trace` object passed contains the information given to the in-processe `trace()` call, along with additional metadata such as `trace.timestamp`.

 We can use this data to od anything we like, here we're simply mapping the requset ids to output deltas between the two.

```js
var m = {};

exports['request:start'] = function(trace){
  m[trace.id] = trace.timestamp;
};

exports['request:end'] = function(trace){
  var d = Date.now() - m[trace.id];
  console.log('%s -> %sms', trace.id, d);
};
```

 To run the script just pass it to `jstrace(1)` and watch the output flow!

```
$ jstrace response-duration.js

298 -> 50ms
302 -> 34ms
299 -> 112ms
287 -> 184ms
289 -> 188ms
297 -> 124ms
286 -> 218ms
295 -> 195ms
300 -> 167ms
304 -> 161ms
307 -> 116ms
301 -> 206ms
305 -> 136ms
314 -> 19ms
```

### Other use cases

  The possibilities really are endless, for example you could produce dynamic, realtime histograms from production data:

```
  404 | ########################################################### | 85
  201 | ####################################################        | 75
  400 | ###########################################                 | 63
  500 | ###########################################                 | 63
  200 | ######################################                      | 55
  505 | ###################################                         | 51


  200 | ########################################################### | 22
  201 | ###########################################                 | 16
  400 | ###########################################                 | 16
  404 | ###########################################                 | 16
  500 | ########################################                    | 15
  505 | #####################################                       | 14

...
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