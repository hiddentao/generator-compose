"use strict";

var chai = require('chai');

exports.assert = chai.assert;
exports.expect = chai.expect;
exports.should = chai.should();


var compose = require('./');


var test = module.exports = {};


test['empty'] = function*() {
  yield compose();
};


test['normal chain - no params'] = function*() {
  var output = [];

  var middleware = [
    function*(next) {
      output.push(23);

      yield next;
    },
    function*(next) {
      output.push(98);

      yield next;

      output.push(57);
    },
    function*(next) {
      output.push(12);

      yield next;
    },
  ];

  yield compose(middleware);

  output.should.eql([23, 98, 12, 57]);
};


test['normal chain - this context'] = function*() {
  var ctx = [];

  var middleware = [
    function*(next) {
      this.push(23);

      yield next;
    },
    function*(next) {
      this.push(98);

      yield next;

      this.push(57);
    },
    function*(next) {
      this.push(12);

      yield next;
    },
  ];

  yield compose(middleware).call(ctx);

  ctx.should.eql([23, 98, 12, 57]);
};


test['normal chain - params'] = function*() {
  var p1 = [],
    p2 = {},
    p3 = 'bla bla';

  var middleware = [
    function*(arr, obj, str, next) {
      arr.push(23);
      obj[24] = str;

      yield next;
    },
    function*(arr, obj, str, next) {
      arr.push(98);
      obj[99] = str;

      yield next;

      arr.push(57);
      obj[58] = str;
    },
    function*(arr, obj, str, next) {
      arr.push(12);
      obj[13] = str;

      yield next;
    },
  ];

  yield compose(middleware).call(null, p1, p2, p3);

  p1.should.eql([23, 98, 12, 57]);
  p2.should.eql({
    24: 'bla bla',
    99: 'bla bla',
    58: 'bla bla',
    13: 'bla bla',
  });
};



test['error'] = function*() {
  var p1 = [],
    p2 = {},
    p3 = 'bla bla';

  var middleware = [
    function*(arr, obj, str, next) {
      arr.push(23);
      obj[24] = str;

      yield next;
    },
    function*(arr, obj, str, next) {
      arr.push(98);
      obj[99] = str;

      yield next;

      throw new Error('noooo!');
    },
    function*(arr, obj, str, next) {
      arr.push(12);
      obj[13] = str;

      yield next;
    },
  ];

  try {
    yield compose(middleware).call(null, p1, p2, p3);

    throw new Error('unexpected');
  } catch (err) {
    err.message.should.eql('noooo!');
  } finally {
    p1.should.eql([23, 98, 12]);
    p2.should.eql({
      24: 'bla bla',
      99: 'bla bla',
      13: 'bla bla',
    });
  }
};



