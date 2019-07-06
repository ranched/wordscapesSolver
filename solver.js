// Wordscapes solver v0.1
const dictionary = require('./words_dictionary.json');

const drawSurroundingSpaces = (board, i, j) => {
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
};
const findIntersections = board => {
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
};

/**
 * @param {array} board represented by two dimentional array
 * @returns {object} key value pairs with keys being the nth word found and
 *      the value being an array containing all indices in the board array
 *      which contain a letter of that word
 */
function findAcross(board) {
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
}
function findDown(board) {
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
        console.log('no previous row exists');
        //first row case
        // if this is the first row and the beginning of a word
        if (currentRow[currentColumn] === 1 && nextRow[currentColumn] === 1) {
          currentWord.push([i, currentColumn]);
        }
      } else if (previousRow && nextRow) {
        console.log('prev and next row exist');
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
        console.log('should be last row');
        //last row case
        // if this row and the previous both had the value of '1' add it to the current word
        if (currentRow[currentColumn] === 1 && previousRow[currentColumn]) {
          currentWord.push([i, currentColumn]);
        }
        // if this is a continuation of a word add it to the list
        if (currentWord.length !== 0) {
          console.log('last row cut word');
          cutNewWord();
        }
      }
      console.log('i ', i, ' words:', words);
      console.log('currentWord:', currentWord);
    }
  }
  return words;
}
// function permutationGen(num) {
//   var arr = (num + '').split('');
//   var permutations = [];

//   function swap(a, b) {
//     var tmp = arr[a];
//     arr[a] = arr[b];
//     arr[b] = tmp;
//   }

//   function generate(n) {
//     if (n == 1) {
//       if (dictionary[arr.join('')]) permutations.push(arr.join(''));
//     } else {
//       for (var i = 0; i != n; ++i) {
//         generate(n - 1);
//         swap(n % 2 ? 0 : i, n - 1);
//       }
//     }
//   }

//   generate(arr.length);
//   var unique = permutations.filter((v, i, a) => a.indexOf(v) === i);
//   return unique;
// }

exports.findIntersections = findIntersections;
exports.drawSurroundingSpaces = drawSurroundingSpaces;
exports.findAcross = findAcross;
exports.findDown = findDown;
// exports.permutationGen = permutationGen;
