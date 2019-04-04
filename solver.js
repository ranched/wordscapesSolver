// Wordscapes solver v0.1
const dictionary = require('./words_dictionary.json');

const drawSurroundingSpaces = (board, i, j) => {
  let surroundingSpaces = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

  console.log('board[', i, j, ']');
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
  console.log(JSON.stringify(surroundingSpaces));
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

const generatePermutations = (arr, size, n, results = []) =>
  { 
      // if size becomes 1 then prints the obtained 
      // permutation 
      if (size == 1) {
          results.push(arr.join(''));
          console.log(arr); 
          //return results;
      }
      for (let i=0; i<size; i++) 
      { 
        generatePermutations(arr, size-1, n); 

          // if size is odd, swap first and last 
          // element 
          if (size % 2 == 1) 
          { 
              let temp = arr[0]; 
              arr[0] = arr[size-1]; 
              arr[size-1] = temp; 
          } 

          // If size is even, swap ith and last 
          // element 
          else
          { 
              let temp = arr[i]; 
              arr[i] = arr[size-1]; 
              arr[size-1] = temp; 
          } 
      } 
      //console.log(size, results);
      return results;
  } 



exports.findIntersections = findIntersections;
exports.drawSurroundingSpaces = drawSurroundingSpaces;
exports.generatePermutations = generatePermutations;
