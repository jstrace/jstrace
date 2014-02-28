
var utils = require('../lib/utils');
var assert = require('assert');

describe('utils.pattern(str)', function(){
  it('should convert to regular expressions', function(){
    var re = utils.pattern('foo:bar:baz');
    re.should.eql(/^foo\:bar\:baz$/i);

    assert(true == re.test('foo:bar:baz'));
    assert(true == re.test('foo:bar:Baz'));
    assert(false == re.test('foo:bar:baz:hey'));
    assert(false == re.test('foo:bar:ba'));

    var re = utils.pattern('foo:*:baz');
    re.should.eql(/^foo\:.+?\:baz$/i);

    assert(true == re.test('foo:hey:baz'));
    assert(true == re.test('foo:something:here:baz'));
    assert(false == re.test('foo:something:here'));;

    var re = utils.pattern('[foo-bar]:baz')
    re.should.eql(/^\[foo-bar\]\:baz$/i);

    assert(true == re.test('[foo-bar]:baz'));
    assert(false == re.test('[foo-bar]:'));

    var re = utils.pattern('*');
    assert(true == re.test('foo'));
    assert(true == re.test('foo:bar:baz'));
    assert(true == re.test('foo:Hey'));
  })
})

describe('utils.patterns(patterns)', function(){
  it('should convert to a master regexp', function(){
    var re = utils.patterns(['foo:bar', 'bar:*', 'baz']);
    re.should.eql(/^(foo\:bar)|(bar\:.+?)|(baz)$/);

    assert(true == re.test('foo:bar'));
    assert(true == re.test('bar:baz'));
    assert(true == re.test('bar:hey'));
    assert(true == re.test('baz'));
    assert(false == re.test('asdf'));
    assert(false == re.test('foo:stuff'));
    assert(false == re.test('foo:'));
  })
})