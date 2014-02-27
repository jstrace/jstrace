
/**
 * Module dependencies.
 */

var Server = require('./server');
var assert = require('assert');
var punt = require('punt');

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
  if (!server.subscribing) return;
  server.send(name, obj);
};