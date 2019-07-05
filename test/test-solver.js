var fs = require('fs');
var expect = require('chai').expect;
var assert = require('chai').assert;
var chai = require('chai');
chai.use(require('chai-fs'));

var solver = require('../solver.js');

let board = [
  [1, 0, 1, 0, 0],
  [1, 0, 1, 1, 1],
  [1, 1, 1, 0, 0],
  [0, 0, 1, 0, 0]
];

describe('wordscape solver', function() {
  describe('findIntersections', function() {
    it('is a function', function(done) {
      expect(solver.findIntersections).to.be.a('function');
      done();
    });

    it('returns an array similarly sized to the input', function(done) {
      let actual = solver.findIntersections(board);
      expect(actual).to.be.an('array');
      expect(actual).to.have.lengthOf(board.length, 'rows mismatch');
      expect(actual[0]).to.have.lengthOf(board[0].length, 'columns mismatch');
      done();
    });
  });

  describe('findAcross', function() {
    it('is a function', function() {
      expect(solver.findAcross).to.be.a('function');
    });

    it('returns an object', function() {
      let actual = solver.findAcross([]);
      expect(actual).to.be.an('object');
    });

    it('returns empty object for empty row', function() {
      let actual = solver.findAcross([]);
      expect(actual).to.not.have.own.property('1');
    });

    it('finds a word in row', function() {
      let actual = solver.findAcross([[1, 1, 1, 1, 1]]);
      expect(actual)
        .to.have.own.property('1')
        .that.is.an('array');
      expect(actual['1']).to.eql([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]);
    });
    it('finds two words in a row', function() {
      let actual = solver.findAcross([[1, 1, 0, 1, 1]]);
      expect(actual['1']).to.eql([[0, 0], [0, 1]]);
      expect(actual['2']).to.eql([[0, 3], [0, 4]]);
    });
    it('does not find single letters in a row', function() {
      let actual = solver.findAcross([[0, 1, 0, 1, 0]]);
      expect(actual['1']).to.not.exist;
    });
    it('finds words in multiple rows', function() {
      let actual = solver.findAcross([[1, 1, 1, 1, 1], [1, 1, 0, 1, 1]]);
      expect(actual['1']).to.eql([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]);
      expect(actual['2']).to.eql([[1, 0], [1, 1]]);
      expect(actual['3']).to.eql([[1, 3], [1, 4]]);
    });
  });

  describe('drawSurroundingSpaces', function() {
    it('is a function', function(done) {
      expect(typeof solver.drawSurroundingSpaces).to.equal('function');
      done();
    });
  });

  xdescribe('permutationGen', function() {
    it('is a function', function(done) {
      expect(typeof solver.permutationGen).to.equal('function');
      done();
    });
    it('returns a value', function(done) {
      expect(solver.permutationGen('123')).to.not.equal(undefined);
      done();
    });
    it("returns correct result for '123'", function(done) {
      let expected = ['apple', 'appel', 'pepla'];
      expect(solver.permutationGen('apple')).to.eql(expected);
      done();
    });
  });
});
