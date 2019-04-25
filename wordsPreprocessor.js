// This file is to preprocess a word list for faster lookup
// it will iterate over every word in the word list
// arrange the letters in alphabetical order (eg. apple => aelpp)
// add the newly ordered string to an object as a key
// add to that key an object containing the original word as a
// key and 1 as a value

// this facillitates faster lookups for combinations of letters in words
// as an alternative to generating all permutations and then
// checking if its a word

// This idea came from a comment on a stackexchange code review
// reponse about permutations
// Based on Jason Goemaat's comment on Viziionary's answer in
// https://codereview.stackexchange.com/questions/57161/generate-all-possible-combinations-of-letters-in-a-word/57893#57893

const fsPromises = require('fs').promises;
const dictionary = require('./words_dictionary.json');

function writeObjectToFile(path, object) {
  return fsPromises.writeFile(path, JSON.stringify(object)).catch(err => {
    console.log(err);
  });
}

function optimize(dictionary) {
  let optimizedDictionary = {};

  // it will iterate over every word in the word list
  for (let word in dictionary) {
    // arrange the letters in alphabetical order (eg. apple => aelpp)
    let wordSorted = word
      .split('')
      .sort()
      .join('');

    // add the newly ordered string to an object as a key and to
    // that key add an object containing the original word as a
    // key and 1 as a value
    // aelpp => { aelpp: { apple: 1 }}
    if (optimizedDictionary[wordSorted]) {
      optimizedDictionary[wordSorted][word] = 1;
    } else {
      optimizedDictionary[wordSorted] = {};
      optimizedDictionary[wordSorted][word] = 1;
    }
  }
  return optimizedDictionary;
}

async function createOptimizedDictionary(dictionary, newFileName) {
  let optimizedDictionary = optimize(dictionary);
  await writeObjectToFile(newFileName, optimizedDictionary);
}

exports.createOptimizedDictionary = createOptimizedDictionary;
exports.writeObjectToFile = writeObjectToFile;
exports.optimize = optimize;
