// Wordscapes solver v0.1
//const dictionary = require('../../words_dictionary.json');
const optimizedDictionary = require('../optimized_dictionary.json');
var jsCombinatorics = require('js-combinatorics');

function drawSurroundingSpaces(board, i, j) {
  let surroundingSpaces = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

  //
  for (let k = i - 1, a = 0; k <= i + 1; k++, a++) {
    for (let l = j - 1, b = 0; l <= j + 1; l++, b++) {
      if (k >= 0 && l >= 0 && k < board.length) {
        if (board[k][l]) {
          surroundingSpaces[a][b] = 1;
        }
      }
    }
  }
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
 * @param {array} board two dimentional array
 * @returns {object} key value pairs with keys being the number of the nth word found and
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
        words[currentWordNumber] = currentWord;
        currentWordNumber++;
        currentWord = [];
      }
    }
  }
  return words;
};

/**
 * @param {array} board represented by two dimentional array
 * @returns {object} key value pairs with keys being the nth word found and
 *      the value being an array containing all indices in the board array
 *      which contain a letter of that word
 */
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
        // if no previous row exists
        // if this is the first row and the beginning of a word
        if (currentRow[currentColumn] === 1 && nextRow[currentColumn] === 1) {
          currentWord.push([i, currentColumn]);
        }
      } else if (previousRow && nextRow) {
        // if prev and next row exist
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
        // this should be last row
        // if this row and the previous both had the value of '1' add it to the current word
        if (currentRow[currentColumn] === 1 && previousRow[currentColumn]) {
          currentWord.push([i, currentColumn]);
        }
        // if this is a continuation of a word add it to the list
        if (currentWord.length !== 0) {
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
  if (
    !Array.isArray(wordLengths) ||
    !Array.isArray(letters) ||
    !wordLengths ||
    !letters
  ) {
    throw new TypeError(
      'wordLengths and letters are required arguments and must be arrays'
    );
  }
  let combinations = {};
  // add all letter combinations of various lengths to the combinations object
  wordLengths.reduce((acc, len) => {
    if (len >= min) {
      //generate combinations for the current length
      let currentLengthCombinations = jsCombinatorics
        .combination(letters, len)
        .toArray();
      lenCombosObj = currentLengthCombinations.reduce((acc, cur) => {
        acc[cur.sort().join('')] = len;
        return acc;
      }, {});
      // store the result in the combinations
      acc[len] = lenCombosObj;
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
  let dictionaryWords = {};
  wordLengths.forEach(length => {
    dictionaryWords[length] = [];
  });

  Object.entries(letterCombosToCheckAgainstDict)
    // for each word length
    .forEach(lengthAndComboTuple => {
      let length = lengthAndComboTuple[0];
      let combos = Object.keys(lengthAndComboTuple[1]);
      // for each combo of this length
      combos.forEach(combo => {
        let sortedCombo = combo
          .split('')
          .sort()
          .join('');
        // check if this sorted combination appears in the optimized dictionary index
        let foundDictionaryWords = queryDictionary(sortedCombo);
        if (foundDictionaryWords) {
          // if it does add it, add the dictionary words associated with this
          // combo to the dictionary words found
          dictionaryWords[length] = [
            ...dictionaryWords[length],
            ...Object.keys(foundDictionaryWords)
          ];
        }
      });
    });

  return dictionaryWords;
};

const findWords = boardAndLetters => {
  let solution = {
    error: '',
    words: {}
  };
  if (!boardAndLetters) {
    solution.error = ' - no board and letters provided';
    return solution;
  }
  const { puzzleLayout, letters } = boardAndLetters;
  // if empty board layout passed in
  if (puzzleLayout.filter(arr => arr.includes(1)).length === 0) {
    solution.error += ' - no board layout provided';
    return solution;
  }
  // if no letters passed in
  if (letters.length == 0) {
    solution.error += ' - no letters provided';
    return solution;
  }
  // find word slots in board layout
  let wordSlots = getWordSlotsFromBoardLayout(puzzleLayout);

  // find word lengths from given word slots
  let wordLengths = getWordLengthsFromSlots(wordSlots);

  // check to make sure there are enough letters to make the longest word
  if (letters.length < Math.max.apply(null, wordLengths)) {
    solution.error += ' - not enough letters provided';
    return solution;
  }

  solution.words = getPossibleWords(wordLengths, letters.split(''));

  return solution;
};

const combineBoards = (boardA, boardB) => {
  let equalRows = boardA.length === boardB.length;
  let equalColumns = boardA[0].length === boardB[0].length;
  let combinedBoard = [];
  if (equalRows && equalColumns) {
    // make a new blank board the same size as the input boards
    for (let rows = 0; rows < boardA.length; rows++) {
      combinedBoard.push([]);
    }
    // fill the combined board if the value of A or B is 1
    for (let i = 0; i < boardA.length; i++) {
      for (let j = 0; j < boardA[0].length; j++) {
        // if A or B has a value, fill the combined board
        combinedBoard[i][j] = boardA[i][j] || boardB[i][j];
        // force boolean to integer
        combinedBoard[i][j] = combinedBoard[i][j] | 0;
        //console.log(combinedBoard[i][j]);
      }
    }
  }
  return combinedBoard;
};

const findSolutions = (board, wordSlots, letters) => {
  return [];
};

exports.drawSurroundingSpaces = drawSurroundingSpaces; // for testing
exports.findIntersections = findIntersections;
exports.generateCombinations = generateCombinations; // for testing
exports.queryDictionary = queryDictionary; // for testing
exports.combineBoards = combineBoards; // for testing
exports.findAcross = findAcross;
exports.findDown = findDown;
exports.findWords = findWords;
exports.findSolutions = findSolutions;
