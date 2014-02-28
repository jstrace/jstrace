
/**
 * Module dependencies.
 */

var escape = require('escape-regexp');

/**
 * Convert pattern `str` into a regexp.
 *
 * @param {String} str
 * @return {RegExp}
 * @api private
 */

exports.pattern = function(str){
  return new RegExp('^' + pattern(str) + '$', 'i');
};

/**
 * Convert patterns array into a master regexp.
 *
 * @param {Array} arr
 * @return {RegExp}
 * @api private
 */

exports.patterns = function(arr){
  var str = arr.map(function(str){
    return '(' + pattern(str) + ')';
  }).join('|');

  return new RegExp('^' + str + '$');
};

/**
 * Return pattern string.
 */

function pattern(str) {
  return escape(str).replace(/\\\*/g, '.+?');
}