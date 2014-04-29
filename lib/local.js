
/**
 * Module dependencies.
 */

var debug = require('debug')('jstrace:local');
var actorify = require('actorify');
var assert = require('assert');
var utils = require('./utils');
var Batch = require('batch');
var net = require('net');

/**
 * Expose `Local`.
 */

module.exports = Local;

/**
 * Initialize with the given `opts`.
 *
 *  - `pid` optional pid to trace
 *  - `title` optional process name to trace
 *  - `hostname` optional hostname to trace
 *  - `remote` optional remote function
 *
 * @param {Object} opts
 * @api public
 */

function Local(opts) {
  opts = opts || {};
  this.opts = opts;
  this.opts.patterns = [];
  this.handlers = [];
  this.actors = [];
  if (opts.remote) opts.remote = opts.remote.toString();
}

/**
 * Listen on `pattern` and invoke `fn()`.
 *
 * @param {String} pattern
 * @param {Function} fn
 * @api public
 */

Local.prototype.on = function(pattern, fn){
  debug('on %j', pattern);
  this.opts.patterns.push(pattern);
  this.handlers.push({
    regexp: utils.pattern(pattern),
    pattern: pattern,
    fn: fn
  });
};

/**
 * Handle socket and subscribe to traces.
 *
 * @param {Socket} sock
 * @api private
 */

Local.prototype.onsocket = function(sock){
  debug('subscribe %j', this.opts);
  var actor = actorify(sock);
  this.actors.push(actor);
  actor.send('subscribe', this.opts);
  actor.on('trace', this.trace.bind(this));
  actor.on('event', this.event.bind(this));
  actor.on('stdout', this.stdout.bind(this));
  actor.on('stderr', this.stderr.bind(this));
  actor.on('error', this.error.bind(this));
};

/**
 * Handle stdout message.
 *
 * @param {String|Buffer} msg
 * @param {Function=} reply
 * @api private
 */

Local.prototype.stdout = function(msg, reply){
  debug('stdout %j', msg);
  process.stdout.write(msg, reply);
};

/**
 * Handle stderr message.
 *
 * @param {String|Buffer} msg
 * @param {Function=} reply
 * @api private
 */

Local.prototype.stderr = function(msg, reply){
  debug('stderr %j', msg);
  process.stderr.write(msg, reply);
};

/**
 * Pass `event` to the matching pattern methods.
 *
 * @param {Object} event
 * @api private
 */

Local.prototype.event = function(event){
  this.handlers.forEach(function(h){
    if (!h.regexp.test(event.name)) return;
    h.fn.apply(null, event.args);
  });
};

/**
 * Pass `trace` to the matching pattern methods.
 *
 * @param {Object} trace
 * @api private
 */

Local.prototype.trace = function(trace){
  this.handlers.forEach(function(h){
    if (!h.regexp.test(trace.name)) return;
    h.fn(trace);
  });
};

/**
 * Print remote errors.
 *
 * @param {String} stack
 * @api private
 */

Local.prototype.error = function(stack){
  console.error(stack);
};

/**
 * Start the server.
 *
 * @api private
 */

Local.prototype.start = function(){
  debug('start');
  this.server = net.createServer(this.onsocket.bind(this));
  this.server.listen(4322);
};

/**
 * Tell remotes to clean up.
 *
 * @param {Function} fn
 * @api private
 */

Local.prototype.cleanup = function(fn){
  debug('cleanup');
  var batch = new Batch;
  this.actors.forEach(function(actor){
    batch.push(function(done){
      actor.send('cleanup', done);
    });
  });
  batch.end(fn);
};
