
/**
 * Module dependencies.
 */

var debug = require('debug')('jstrace:server');
var actorify = require('actorify');
var assert = require('assert');
var Backoff = require('backo');
var utils = require('./utils');
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
  this.regexp = null;
  this.subscribing = false;
}

/**
 * Subscribe to the given `opts`.
 *
 * @param {Object} opts
 * @api private
 */

Server.prototype.subscribe = function(opts){
  debug('subscribe %j', opts);

  // pid filtering
  if (opts.pid && opts.pid != self.pid) return debug('pid mismatch');

  // process title filtering
  if (opts.name && opts.name != self.title) return debug('title mismatch');

  // patterns
  this.regexp = utils.patterns(opts.patterns);
  this.subscribing = true;
};

/**
 * Unsubscribe from all patterns.
 *
 * @api private
 */

Server.prototype.unsubscribe = function(){
  debug('unsubscribe');
  this.subscribing = false;
};

/**
 * Check if any subscription patterns match the probe `name`.
 *
 * @param {String} name
 * @return {Boolean}
 * @api private
 */

Server.prototype.subscribed = function(name){
  return this.regexp.test(name);
};

/**
 * Send trace data to the client.
 *
 * @param {String} name
 * @param {Object} obj
 * @api private
 */

Server.prototype.send = function(name, obj){
  if (!this.actor) return debug('no actor');

  var msg = merge({
    timestamp: Date.now(),
    title: this.title,
    pid: this.pid,
    name: name
  }, obj);

  this.actor.send('trace', msg);
};

/**
 * Communicate with the peer.
 *
 * @param {Socket} sock
 * @api private
 */

Server.prototype.onconnection = function(sock){
  var actor = this.actor = actorify(sock);
  actor.on('subscribe', this.subscribe.bind(this));
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
 * @return {Object} a
 * @api private
 */

function merge(a, b) {
  if (!b) return a;

  if (b.toJSON) b = b.toJSON();

  Object.keys(b).forEach(function(k){
    a[k] = b[k];
  });

  return a;
}
