var expect = require('chai').expect;
var assert = require('chai').assert;
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
      expect(typeof solver.findIntersections).to.equal('function');
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
  describe('drawSurroundingSpaces', function() {
    it('is a function', function(done) {
      expect(typeof solver.drawSurroundingSpaces).to.equal('function');
      done();
    });
  });
  describe('generatePermutations', function() {
    it('is a function', function(done) {
      expect(typeof solver.generatePermutations).to.equal('function');
      done();
    });
    it('returns a value', function(done) {
      expect(solver.generatePermutations([1, 2, 3], 3, 3)).to.not.equal(undefined);
      done();
    });
  });

});
