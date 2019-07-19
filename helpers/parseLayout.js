// Wordscapes solver v0.1
//const dictionary = require('../../words_dictionary.json');
const optimizedDictionary = require('../optimized_dictionary.json');
var jsCombinatorics = require('js-combinatorics');

function drawSurroundingSpaces(board, i, j) {
  let surroundingSpaces = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

  //console.log('board[', i, j, ']');
  //
  for (let k = i - 1, a = 0; k <= i + 1; k++, a++) {
    for (let l = j - 1, b = 0; l <= j + 1; l++, b++) {
      if (k >= 0 && l >= 0 && k < board.length) {
        //console.log('a:', a, 'b:', b);
        if (board[k][l]) {
          surroundingSpaces[a][b] = 1;
        }
      }
    }
  }
  //console.log(JSON.stringify(surroundingSpaces));
}
function findIntersections(board) {
  let intersectionMatrix = Array.from(board);

  // takes a surrounding spaces array and determins if this
  // spot on the board is an intersection of two words
  const testIntersection = arr => {};

  // draw surround spaces array
  // for each row in the board
  for (let i = 0; i < board.length; i++) {
    // for each column in the board
    for (let j = 0; j < board[0].length; j++) {
      drawSurroundingSpaces(board, i, j);
    }
  }
  return intersectionMatrix;
}

/**
 * @param {array} board represented by two dimentional array
 * @returns {object} key value pairs with keys being the nth word found and
 *      the value being an array containing all indices in the board array
 *      which contain a letter of that word
 */
const findAcross = board => {
  if (!board || !board[0]) return {};

  let words = {};
  let currentWordNumber = 1;
  let currentWord = [];

  for (let j = 0; j < board.length; j++) {
    for (let i = 0; i <= board[j].length; i++) {
      // if theres a '1' in the space AND the previous or next space in
      // the row also has the value of '1'
      if (
        board[j][i] === 1 &&
        (board[j][i - 1] === 1 || board[j][i + 1] === 1)
      ) {
        // add the index to the current word array
        currentWord.push([j, i]);
        // if there's not a current work being worked on
        // move on to the next space, otherwise we just finished
        // iterating over a word and we need to put it in the words
        // object to be returned
      } else if (currentWord.length !== 0) {
        //console.log(i, words, currentWord);
        words[currentWordNumber] = currentWord;
        currentWordNumber++;
        currentWord = [];
      }
    }
  }
  return words;
};

const findDown = board => {
  if (!board || !board[0]) return {};

  let words = {};
  let currentWordNumber = 1;
  let currentWord = [];

  const cutNewWord = () => {
    words[currentWordNumber] = currentWord;
    currentWordNumber++;
    currentWord = [];
  };

  for (let j = 0; j < board[0].length; j++) {
    for (let i = 0; i < board.length; i++) {
      let previousRow = board[i - 1];
      let currentRow = board[i];
      let nextRow = board[i + 1];
      let currentColumn = j;

      if (!previousRow) {
        //console.log('no previous row exists');
        //first row case
        // if this is the first row and the beginning of a word
        if (currentRow[currentColumn] === 1 && nextRow[currentColumn] === 1) {
          currentWord.push([i, currentColumn]);
        }
      } else if (previousRow && nextRow) {
        //console.log('prev and next row exist');
        //middle rows case
        // check if this is the continuation of a word OR if we're starting a new word
        if (
          currentRow[currentColumn] === 1 &&
          (previousRow[currentColumn] || nextRow[currentColumn] === 1)
        ) {
          currentWord.push([i, currentColumn]);
        } else if (currentWord.length !== 0) {
          cutNewWord();
        }
      } else {
        //console.log('should be last row');
        //last row case
        // if this row and the previous both had the value of '1' add it to the current word
        if (currentRow[currentColumn] === 1 && previousRow[currentColumn]) {
          currentWord.push([i, currentColumn]);
        }
        // if this is a continuation of a word add it to the list
        if (currentWord.length !== 0) {
          //console.log('last row cut word');
          cutNewWord();
        }
      }
    }
  }
  return words;
};

const queryDictionary = letters => {
  let words = optimizedDictionary[letters];
  return words;
};

const getWordLengthsFromSlots = slots => {
  let allWordLengths = [
    ...Object.values(slots.across),
    ...Object.values(slots.down)
  ].map(arr => arr.length);

  let lengths = new Set(allWordLengths).values();
  let lengthsArr = [];

  for (value of lengths) {
    lengthsArr.push(value);
  }

  return lengthsArr;
};

const getWordSlotsFromBoardLayout = puzzleLayout => {
  return {
    across: findAcross(puzzleLayout),
    down: findDown(puzzleLayout)
  };
};

// generate letter combinations for given letters, lengths min -> 7
/**
 * @param {array} wordLengths array of numbers
 * @param {array} letters array of characters
 * @param {number} min
 * @returns {object} wordLength as the key
 *      and the value being an array of letter
 *      combination arrays of the current wordLength
 */
const generateCombinations = (wordLengths, letters, min = 3) => {
  // console.log(typeof wordLengths[0]);
  // console.log(Array.isArray(letters));
  let combinations = {};

  // add all letter combinations of various lengths to the combinations object
  wordLengths.reduce((acc, cur) => {
    if (cur >= min) {
      //generate combinations for the current length
      let currentLengthCombinations = jsCombinatorics
        .combination(letters, cur)
        .toArray();
      // store the result in the combinations
      acc[cur] = currentLengthCombinations;
    }
    return acc;
  }, combinations);

  return combinations;
};

// query the optimized dictionary for possible words of
const getPossibleWords = (wordLengths, letters) => {
  //let words = {};
  let letterCombosToCheckAgainstDict = generateCombinations(
    wordLengths,
    letters
  );
  //solutions.possibleWords = queryDictionary(boardAndLetters.letters);

  return letterCombosToCheckAgainstDict;
};

const findWords = boardAndLetters => {
  const { puzzleLayout, letters } = boardAndLetters;
  let solution = {
    error: '',
    words: {}
  };

  if (puzzleLayout.filter(arr => arr.includes(1)).length === 0) {
    solution.error += ' - no board layout provided';
    return solution;
  }
  if (letters.length == 0) {
    solution.error += ' - no letters provided';
    return solution;
  }

  let wordSlots = getWordSlotsFromBoardLayout(puzzleLayout);
  let wordLengths = getWordLengthsFromSlots(wordSlots);

  solution.words = getPossibleWords(wordLengths, letters.split(''));

  return solution;
};

exports.findAcross = findAcross;
exports.findDown = findDown;
exports.findWords = findWords;
