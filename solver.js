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

function findAcross(board) {
  if (!board || !board[0]) return {};

  let words = {};
  let currentWordNumber = 1;
  let currentWord = [];

  for (let j = 0; j < board.length; j++) {
    for (let i = 0; i <= board[j].length; i++) {
      // if theres something in the first space OR if the previous/next space has something
      if (
        board[j][i] === 1 &&
        (board[j][i - 1] === 1 || board[j][i + 1] === 1)
      ) {
        currentWord.push([j, i]);
      } else if (currentWord.length !== 0) {
        console.log(i, words, currentWord);
        words[currentWordNumber] = currentWord;
        currentWordNumber++;
        currentWord = [];
      }
    }
  }
  console.log('wordsObj:', words);
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
// exports.permutationGen = permutationGen;
