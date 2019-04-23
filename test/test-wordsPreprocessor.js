var fsPromises = require('fs').promises;
var expect = require('chai').expect;
var assert = require('chai').assert;
var chai = require('chai');
chai.use(require('chai-fs'));

var preprocessor = require('../wordsPreprocessor.js');

describe('writeObjectToFile', function() {
  it('is a function', function(done) {
    expect(preprocessor.writeObjectToFile).to.be.a('function');
    done();
  });

  it('returns a promise', async function() {
    let result = preprocessor.writeObjectToFile('file.json', "{ a: 'test' }");
    console.log('type: ' + typeof result);
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
    let data =
      '{"aelpp":{"apple":1,"appel":1,"pepla":1},"aaabnn":{"banana":1}}';
    let path = 'file.json';
    let dictionary = { apple: 1, appel: 1, banana: 1, pepla: 1 };

    await preprocessor.optimize(dictionary, path);

    expect(path)
      .to.be.a.file('file exists')
      .with.content(data, 'has correct content');

    await fsPromises.unlink('file.json');
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

    xit('is a function', function(done) {
      expect(preprocessor.optimize).to.be.a('function');
      done();
    });

    xit('returns an object', function(done) {
      let actual = preprocessor.optimize(dictionary);
      expect(actual).to.be.an('object');
      done();
    });

    xit('returns an object with alphabetized keys', function(done) {
      let actual = preprocessor.optimize(dictionary);
      expect(actual).to.have.property('aelpp');
      expect(actual).to.have.property('aaabnn');
      done();
    });

    xit('returns an object with alphabetized keys containing original words as keys', function(done) {
      let actual = preprocessor.optimize(dictionary);
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
});
