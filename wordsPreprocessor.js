// This file is to preprocess a word list for faster lookup
// it will iterate over every word in the word list
// arrange the letters in alphabetical order (eg. apple => aelpp)
// add the newly ordered string to an object as a key
// add to that key an object containing the original word as a key and 1 as a value

// this facillitates faster lookups for combinations of letters in words
// as an alternative to generating all permutations and then checking if its a word

// This idea came from a comment on a stackexchange code review reponse about permutations
// Based on Jason Goemaat's comment on Viziionary's answer in
// https://codereview.stackexchange.com/questions/57161/generate-all-possible-combinations-of-letters-in-a-word/57893#57893

const fs = require('fs');
const dictionary = require('./words_dictionary.json');

function optimize(dictionary) {
  let optimizedDictionary = {};

  // it will iterate over every word in the word list
  for (let word in dictionary) {
    // arrange the letters in alphabetical order (eg. apple => aelpp)
    let wordSorted = word
      .split('')
      .sort()
      .join('');

    // add the newly ordered string to an object as a key and to that key
    // add an object containing the original word as a key and 1 as a value
    if (optimizedDictionary[wordSorted]) {
      optimizedDictionary[wordSorted][word] = 1;
    } else {
      optimizedDictionary[wordSorted] = {};
      optimizedDictionary[wordSorted][word] = 1;
    }
    console.log(word, optimizedDictionary);
  }
  return optimizedDictionary;
}

function writeObjectToFile(path, object) {
  fs.writeFile('./optimizedDictionary.json', optimizedDictionary, function(
    err
  ) {
    if (err) {
      return console.log(err);
    }
    console.log('The file was saved!');
  });
}

exports.writeObjectToFile = writeObjectToFile;
exports.optimize = optimize;
