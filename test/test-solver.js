var expect = require('chai').expect;
var assert = require('chai').assert;
var chai = require('chai');
chai.use(require('chai-fs'));

var solver = require('../solver.js');
var pre = require('../wordsPreprocessor.js');

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

  describe('permutationGen', function() {
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
describe('wordsPreprocessor', function() {
  describe('optimize', function() {
    let dictionary = {};
    beforeEach(function() {
      dictionary = { apple: 1, appel: 1, banana: 1, pepla: 1 };
    });
    afterEach(function() {
      dictionary = {};
    });
    it('is a function', function(done) {
      expect(typeof pre.optimize).to.equal('function');
      done();
    });
    it('returns an object', function(done) {
      let actual = pre.optimize(dictionary);
      expect(typeof actual).to.equal('object');
      done();
    });
    it('returns an object with alphabetized keys', function(done) {
      let actual = pre.optimize(dictionary);
      expect(actual).to.have.property('aelpp');
      expect(actual).to.have.property('aaabnn');
      done();
    });
    it('returns an object with alphabetized keys containing original words as keys', function(done) {
      let actual = pre.optimize(dictionary);
      expect(actual.aelpp)
        .to.have.property('apple')
        .and.to.equal(1);
      expect(actual.aelpp)
        .to.have.property('appel')
        .and.to.equal(1);
      expect(actual.aelpp)
        .to.have.property('pepla')
        .and.to.equal(1);
      done();
    });
  });
  describe('writeObjectToFile', function() {
    it('is a function', function(done) {
      expect(typeof pre.writeObjectToFile).to.equal('function');
      done();
    });
    it('writes data', function(done){
      expect(path).to.be.a.file('file exists').with.content(data, ?msg);
    });
    it('writes correct data', function(done){
      let data = {aelpp: { apple: 1, appel: 1, pepla: 1}}
      let dictionary = { apple: 1, appel: 1, banana: 1, pepla: 1 };

      pre.optimize(dictionary);
      let path = './optimizedDictionary.json';
      expect(path).to.be.a.file('file exists').with.content(data, 'has correct content');

    });

  });
});
