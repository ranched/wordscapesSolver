var fs = require('fs');
var expect = require('chai').expect;
var assert = require('chai').assert;
var chai = require('chai');
chai.use(require('chai-fs'));

var solver = require('../helpers/parseLayout.js');

let board = [
  [1, 0, 1, 0, 0],
  [1, 0, 1, 1, 1],
  [1, 1, 1, 0, 0],
  [0, 0, 1, 0, 0]
];

describe('parseLayout', function() {
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

  describe('findDown', function() {
    it('is a function', function() {
      expect(solver.findDown).to.be.a('function');
    });

    it('returns an object', function() {
      let actual = solver.findDown([]);
      expect(actual).to.be.an('object');
    });

    it('returns empty object for empty column', function() {
      let actual = solver.findDown([[], []]);
      expect(actual).to.not.have.own.property('1');
    });

    it('finds a word in a column', function() {
      let actual = solver.findDown([[1, 0], [1, 0]]);
      expect(actual)
        .to.have.own.property('1')
        .that.is.an('array');
      expect(actual['1']).to.eql([[0, 0], [1, 0]]);
    });

    it('finds multiple words in a column', function() {
      let actual = solver.findDown([
        [0, 0],
        [1, 0],
        [1, 0],
        [0, 0],
        [1, 0],
        [1, 0]
      ]);
      expect(actual).to.have.own.all.keys('1', '2');
      expect(actual['1']).to.eql([[1, 0], [2, 0]]);
      expect(actual['2']).to.eql([[4, 0], [5, 0]]);
    });

    it('finds multiple words in multiple columns', function() {
      let actual = solver.findDown([
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [1, 1],
        [1, 0]
      ]);
      expect(actual).to.have.own.all.keys('1', '2', '3');
      expect(actual['1']).to.eql([[1, 0], [2, 0]]);
      expect(actual['2']).to.eql([[4, 0], [5, 0]]);
      expect(actual['3']).to.eql([[2, 1], [3, 1], [4, 1]]);
    });
  });

  xdescribe('drawSurroundingSpaces', function() {
    it('is a function', function(done) {
      expect(typeof solver.drawSurroundingSpaces).to.equal('function');
      done();
    });

    it('returns an object', function(done) {
      expect('function return value').to.be.an('object');
      done();
    });
  });

  describe('findWords', function() {
    it('is a function', function(done) {
      expect(typeof solver.findWords).to.equal('function');
      done();
    });

    it('returns an object', function(done) {
      expect(solver.findWords()).to.be.an('object');
      done();
    });

    it('returns an object with word and error properties', function(done) {
      let boardAndLetters = { puzzleLayout: board, letters: 'abcd' };
      let solution = solver.findWords(boardAndLetters);
      expect(solution).to.have.property('error');
      expect(solution).to.have.property('words');
      done();
    });

    it('returns an error when not passed required arguments', function(done) {
      let boardArg = { puzzleLayout: board, letters: '' };
      let lettersArg = { puzzleLayout: [], letters: '' };
      let solution1 = solver.findWords(lettersArg);
      let solution2 = solver.findWords(boardArg);
      expect(solution1)
        .to.have.property('error')
        .that.equals(' - no board layout provided');
      expect(solution2)
        .to.have.property('error')
        .that.equals(' - no letters provided');
      done();
    });

    it('returns an error if number of letters less than longest word slot', function(done) {
      let boardAndLetters = { puzzleLayout: board, letters: 'abc' };
      let solution = solver.findWords(boardAndLetters);
      expect(solution)
        .to.have.property('error')
        .that.equals(' - not enough letters provided');
      done();
    });

    it('returns correct words given letters and board', function(done) {
      let boardAndLetters = {
        puzzleLayout: [
          [0, 1, 1, 1, 0, 1, 0, 0],
          [0, 0, 1, 0, 0, 1, 0, 0],
          [1, 1, 1, 1, 0, 1, 1, 1],
          [1, 0, 1, 0, 1, 0, 1, 0],
          [1, 1, 1, 1, 1, 0, 1, 0],
          [0, 0, 1, 0, 1, 1, 1, 1]
        ],
        letters: 'hoonpt'
      };
      let solution = solver.findWords(boardAndLetters);
      expect(solution.words).to.have.property('3');
      expect(solution.words[3])
        .to.be.an('array')
        .and.have.lengthOf(25);
      expect(solution.words).to.have.property('4');
      expect(solution.words[4]).to.be.an('array');
      expect(solution.words).to.have.property('5');
      expect(solution.words[5]).to.be.an('array');
      done();
    });
  });

  describe('generateCombinations', function() {
    it('is a function', function(done) {
      expect(typeof solver.generateCombinations).to.equal('function');
      done();
    });
    it('throws an error for invalid arguments', function(done) {
      expect(() => solver.generateCombinations('x', '[]')).to.throw();
      done();
    });
    it('returns a value', function(done) {
      expect(
        solver.generateCombinations([3, 4], ['a', 'b', 'c', 'd'])
      ).to.not.equal(undefined);
      done();
    });
    it("returns correct result for '123'", function(done) {
      let expected = {
        3: { abc: 3, abd: 3, acd: 3, bcd: 3 },
        4: { abcd: 4 }
      };
      expect(solver.generateCombinations([3, 4], ['a', 'b', 'c', 'd'])).to.eql(
        expected
      );
      done();
    });
  });

  describe('queryDictionary', function() {
    it('is a function', function(done) {
      expect(typeof solver.queryDictionary).to.equal('function');
      done();
    });
    it('returns words given letters', function(done) {
      expect(solver.queryDictionary('abc')).to.eql({
        abc: 1,
        bac: 1,
        cab: 1
      });
      done();
    });
    it('returns words given letters', function(done) {
      expect(solver.queryDictionary('')).to.eql(undefined);
      done();
    });
  });

  describe('combineBoards', function() {
    let boardA = [
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0]
    ];
    let boardB = [
      [0, 0, 0, 0, 1],
      [0, 0, 0, 0, 1],
      [0, 0, 0, 0, 1],
      [0, 0, 0, 0, 1]
    ];
    it('should be a function', function(done) {
      expect(solver.combineBoards).to.be.a('function');
      done();
    });

    it('should return an array', function(done) {
      expect(solver.combineBoards(boardA, boardB)).to.be.an('array');
      done();
    });

    it('should combine simple boards', function(done) {
      let boardA = [[0, 1], [1, 0]];
      let boardB = [[1, 0], [0, 1]];
      let result = solver.combineBoards(boardA, boardB);
      let expected = [[1, 1], [1, 1]];
      expect(result)
        .to.be.an('array')
        .and.to.eql(expected);
      done();
    });
  });

  describe('findSolutions', function() {
    it('should be a function', function(done) {
      expect(solver.findSolutions).to.be.a('function');
      done();
    });
  });

  describe('checkWordFit', function() {
    it('should be a function', function(done) {
      expect(solver.checkWordFit).to.be.a('function');
      done();
    });
  });

  describe('placeWord', function() {
    it('should be a function', function(done) {
      expect(solver.placeWord).to.be.a('function');
      done();
    });
  });
});
