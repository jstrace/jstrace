
/**
 * Module dependencies.
 */

var debug = require('debug')('jstrace:client');
var Emitter = require('events').EventEmitter;
var actorify = require('actorify');
var assert = require('assert');
var net = require('net');

/**
 * Expose `Client`.
 */

module.exports = Client;

/**
 * Initialize with the given `opts`.
 *
 *  - `pid` optional pid to trace
 *  - `title` optional process name to trace
 *
 * @param {Object} opts
 * @api public
 */

function Client(opts) {
  opts = opts || {};
  this.opts = opts;
}

/**
 * Inherit from `Emitter.prototype`.
 */

Client.prototype.__proto__ = Emitter.prototype;

/**
 * Handle socket and subscribe to traces.
 *
 * @param {Socket} sock
 * @api private
 */

Client.prototype.onsocket = function(sock){
  var handlers = this.handlers;
  var actor = actorify(sock);
  var self = this;

  debug('connection');
  actor.send('subscribe', this.opts);

  actor.on('trace', function(trace){
    // TODO: patterns
    var fn = handlers[trace.name];
    if (fn) fn(trace);
  });
};

/**
 * Start the server.
 *
 * @param {Object} handlers
 * @api private
 */

Client.prototype.start = function(handlers){
  assert(handlers, 'handlers required');
  debug('start');
  this.handlers = handlers;
  this.opts.patterns = Object.keys(handlers);
  this.server = net.createServer(this.onsocket.bind(this));
  this.server.listen(4322);
};
