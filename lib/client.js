
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
  var actor = actorify(sock);
  var self = this;

  debug('connection');
  actor.send('subscribe', this.opts);

  actor.on('trace', function(trace){
    self.emit('trace', trace);
  });
};

/**
 * Start the server.
 *
 * @api private
 */

Client.prototype.start = function(){
  debug('start');
  this.server = net.createServer(this.onsocket.bind(this));
  this.server.listen(4322);
};
