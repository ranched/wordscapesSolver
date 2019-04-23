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

  // it('returns a promise', async function() {
  //   preprocessor
  //     .writeObjectToFile('file.json', "{ a: 'test' }")
  //     .then(result => {
  //       expect(result).to.be.a('promise');
  //     })
  //     .then(() => fsPromises.unlink('file.json'))
  //     .catch(err => console.log(err));
  // });

  it('returns a promise', async function() {
    let result = preprocessor.writeObjectToFile('file.json', "{ a: 'test' }");
    console.log('type: ' + typeof result);
    expect(result).to.be.a('promise');
    return await fsPromises.unlink('file.json');
  });

  it('creates a file', async function() {
    let path = './file.json';
    let data = "{ a: 'test' }";
    await preprocessor.writeObjectToFile('file.json', '{"a": "test"}');

    expect(path)
      .to.be.a.file('file exists')
      .with.content(data, 'data is correct');

    await fsPromises.unlink('./file.json');
  });

  it('writes correct data', function(done) {
    let data = { aelpp: { apple: 1, appel: 1, pepla: 1 } };
    let dictionary = { apple: 1, appel: 1, banana: 1, pepla: 1 };

    let path = 'file.json';
    preprocessor.optimize(dictionary, path);
    expect(path)
      .to.be.a.file('file exists')
      .with.content(data, 'has correct content');
    done();
  });

  // after(function() {
  //   fsPromises.unlink('optimizedDictionary.json');
  // });
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
