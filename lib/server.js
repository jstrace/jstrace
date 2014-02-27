
/**
 * Module dependencies.
 */

var debug = require('debug')('jstrace:server');
var actorify = require('actorify');
var assert = require('assert');
var Backoff = require('backo');
var net = require('net');

/**
 * Expose `Server`.
 */

module.exports = Server;

/**
 * Initialize a new server.
 *
 * @api private
 */

function Server() {
  this.connect = this.connect.bind(this);
  this.backoff = new Backoff({ min: 100, max: 5000 });
  this.title = process.title;
  this.pid = process.pid;
  this.active = false;
  this.port = 4322;
}

/**
 * Subscribe to traces.
 *
 * @api private
 */

Server.prototype.subscribe = function(){
  this.subscribing = true;
};

/**
 * Unsubscribe to traces.
 *
 * @api private
 */

Server.prototype.unsubscribe = function(){
  this.subscribing = false;
};

/**
 * Send trace data to the client.
 *
 * @param {String} name
 * @param {Object} obj
 * @api private
 */

Server.prototype.send = function(name, obj){
  if (!this.actor) return;
  this.actor.send('trace', merge({
    timestamp: Date.now(),
    title: this.title,
    pid: this.pid,
    name: name
  }, obj));
};

/**
 * Communicate with the peer.
 *
 * @param {Socket} sock
 * @api private
 */

Server.prototype.onconnection = function(sock){
  var actor = this.actor = actorify(sock);
  var self = this;

  actor.on('subscribe', function(opts){
    debug('subscribe %j', opts);

    // pid filtering
    if (opts.pid && opts.pid != self.pid) return;

    // process title filtering
    // TODO: pattern matching
    if (opts.name && opts.name != self.title) return;

    // TODO: filtering
    self.subscribe();
  });
};

/**
 * Attempt connection with jstrace(1).
 *
 * @api private
 */

Server.prototype.connect = function(){
  var sock = net.connect(4322);
  var self = this;

  debug('connecting');
  sock.on('connect', function(){
    debug('connected');
    self.backoff.reset();
    self.onconnection(sock);
  });

  sock.on('error', function(err){
    debug('error %s', err.message);
    retry();
  });

  sock.on('end', function(){
    debug('disconnected');
    delete self.actor;
    retry();
  });

  function retry() {
    self.unsubscribe();
    setTimeout(self.connect, self.backoff.duration());
  }
};

/**
 * Start the server.
 *
 * @api private
 */

Server.prototype.start = function(){
  debug('start');
  this.connect();
};

/**
 * Merge `b` into `a` and return `a`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api private
 */

function merge(a, b) {
  if (!b) return a;
  for (var k in b) a[k] = b[k];
  return a;
}