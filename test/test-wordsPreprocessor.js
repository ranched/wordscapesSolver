var fsPromises = require('fs').promises;
var expect = require('chai').expect;
var assert = require('chai').assert;
var chai = require('chai');
chai.use(require('chai-fs'));

var preprocessor = require('../wordsPreprocessor.js');

describe('wordsPreprocessor', function() {
  describe('writeObjectToFile', function() {
    it('is a function', function(done) {
      expect(preprocessor.writeObjectToFile).to.be.a('function');
      done();
    });

    it('returns a promise', async function() {
      let result = preprocessor.writeObjectToFile('file.json', "{ a: 'test' }");
      expect(result).to.be.a('promise');
      return await fsPromises.unlink('file.json');
    });

    it('creates a file', async function() {
      // eslint-disable-next-line
      let data = '{"a":"test"}';
      let path = './file.json';

      await preprocessor.writeObjectToFile('file.json', { a: 'test' });

      expect(path).to.be.a.file('file exists');

      await fsPromises.unlink('./file.json');
    });

    it('writes correct data', async function() {
      // eslint-disable-next-line
      let data = '{"apple":1,"appel":1,"banana":1,"pepla":1}';
      let path = 'file.json';
      let dictionary = { apple: 1, appel: 1, banana: 1, pepla: 1 };

      await preprocessor.writeObjectToFile(path, dictionary);

      expect(path)
        .to.be.a.file('file exists')
        .with.content(data, 'has correct content');

      await fsPromises.unlink('file.json');
    });
  });

  describe('optimize', function() {
    let dictionary = {};

    beforeEach(function() {
      dictionary = { apple: 1, appel: 1, banana: 1, pepla: 1 };
    });

    afterEach(function() {
      dictionary = {};
    });

    it('is a function', function(done) {
      expect(preprocessor.optimize).to.be.a('function');
      done();
    });

    it('returns an object', async function() {
      let actual = await preprocessor.optimize(dictionary);
      expect(actual).to.be.an('object');
    });

    it('returns an object with alphabetized keys', async function() {
      let actual = await preprocessor.optimize(dictionary);
      expect(actual).to.be.an('object');
      expect(actual).to.have.own.property('aelpp');
      expect(actual).to.have.own.property('aaabnn');
    });

    it('returns an object with alphabetized keys containing original words as keys', async function() {
      let actual = await preprocessor.optimize(dictionary);
      expect(actual.aelpp)
        .to.have.property('apple')
        .and.to.equal(1);
      expect(actual.aelpp)
        .to.have.property('appel')
        .and.to.equal(1);
      expect(actual.aelpp)
        .to.have.property('pepla')
        .and.to.equal(1);
    });
  });

  describe('createOptimizedDictionary', function() {
    it('is a function', function() {
      expect(preprocessor.createOptimizedDictionary).to.be.a('function');
    });

    it('writes correct data', async function() {
      // eslint-disable-next-line
      let data =
        '{"aelpp":{"apple":1,"appel":1,"pepla":1},"aaabnn":{"banana":1}}';
      let path = 'file.json';
      let dictionary = { apple: 1, appel: 1, banana: 1, pepla: 1 };

      await preprocessor.createOptimizedDictionary(dictionary, path);
      // let od = await fsPromises.readFile('file.json', { encoding: 'utf8' });
      // console.log(od);
      expect(path)
        .to.be.a.file('file exists')
        .with.content(data, 'has correct content');

      await fsPromises.unlink('file.json');
    });
  });
});
