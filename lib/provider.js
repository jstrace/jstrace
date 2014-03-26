
/**
 * Module dependencies.
 */

var Server = require('./server');
var assert = require('assert');

/**
 * Communication server.
 */

var server = new Server;
server.start();

/**
 * Create a probe with the given `name` and optional properties `obj`.
 *
 * @param {String} name
 * @param {Object} [obj]
 * @api public
 */

module.exports = function(name, obj){
  // global subscription flag, only enabled
  // when the jstrace(1) executable is in use
  if (!server.subscribing) return;

  // is .remote present and subscribed to this probe
  if (server.remote && server.remote.subscribed(name)) {
    server.remote.send(name, obj);
  }

  // is .local present and subscribed to this probe
  if (server.subscribed(name)) server.send(name, obj);
};