// Wordscapes solver v0.1

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

exports.findIntersections = findIntersections;
exports.findIntersections = findIntersections;
