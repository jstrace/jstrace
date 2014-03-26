
/**
 * Module dependencies.
 */

var debug = require('debug')('jstrace:local');
var actorify = require('actorify');
var assert = require('assert');
var utils = require('./utils');
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
  actor.send('subscribe', this.opts);
  actor.on('trace', this.trace.bind(this));
  actor.on('event', this.event.bind(this));
  actor.on('stdio', this.stdio.bind(this));
};

/**
 * Handle stdio message.
 *
 * @param {Object} msg
 * @api private
 */

Local.prototype.stdio = function(msg){
  debug('stdio %j', msg);
  process[msg.stream].write(msg.value);
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
 * Start the server.
 *
 * @api private
 */

Local.prototype.start = function(){
  debug('start');
  this.server = net.createServer(this.onsocket.bind(this));
  this.server.listen(4322);
};
