let cells = document.getElementsByTagName('td');
for (let cell of cells) {
  cell.addEventListener('click', toggleSelected);
}

const handler = e => {
  var newdiv = document.createElement('div');
  newdiv.addEventListener('click', handler);
  newdiv.appendChild(document.createTextNode('some text'));
  document.body.appendChild(newdiv);
};

const handler2 = e => {
  var table = document.getElementsByTagName('table');
  table.insertRow();
};

let addRowTopButton = document.getElementById('addRowTopButton');
let addColumnLeftButton = document.getElementById('addColumnLeftButton');
let addRowBottomButton = document.getElementById('addRowBottomButton');
let addColumnRightButton = document.getElementById('addColumnRightButton');
let findWordsButton = document.getElementById('findWords');

addRowTopButton.addEventListener('click', addRow.bind(null, 0));
addColumnLeftButton.addEventListener('click', addColumn.bind(null, 0));
addRowBottomButton.addEventListener('click', addRow.bind(null, -1));
addColumnRightButton.addEventListener('click', addColumn.bind(null, -1));
findWordsButton.addEventListener('click', getWords);

function addRow(index) {
  // Get a reference to the table
  let tableRef = document.getElementById('crosswordTable');

  // get a reference to all the rows of the table
  let rowRef = tableRef.getElementsByTagName('tr');

  // get the number of td's(children) in the first row
  let rowLen = rowRef[0].children.length;

  // Insert a row at the end of the table
  let newRow = tableRef.insertRow(index);

  // for every existing row in the column,
  // create a new piece of text and
  // add a td to the new row with that text
  for (let i = 0; i < rowLen; i++) {
    let newCell = newRow.insertCell(0);
    newCell.appendChild(document.createTextNode(''));
    newCell.addEventListener('click', toggleSelected);
  }
}

function addColumn(index) {
  // Get a reference to the table
  let rowsRef = document
    .getElementById('crosswordTable')
    .getElementsByTagName('tr');

  for (let row of rowsRef) {
    let newCell = row.insertCell(index);
    newCell.appendChild(document.createTextNode(''));
    newCell.addEventListener('click', toggleSelected);
  }
  // Insert a cell in the row at index 0
}

function toggleSelected() {
  this.classList.toggle('active');
}

function buildCrosswordArray() {
  let table = document.getElementById('crosswordTable');

  let crosswordLayout = [];

  for (let row of table.rows) {
    let currentRow = [];
    for (let cell of row.cells) {
      let cellValue = cell.classList.contains('active') ? 1 : 0;
      currentRow.push(cellValue);
    }
    crosswordLayout.push(currentRow);
  }
  return crosswordLayout;
}

function getWords() {
  let inputLetters = document.getElementById('letters').value;
  axios
    .post('/words', {
      puzzleLayout: buildCrosswordArray(),
      letters: inputLetters
    })
    .then(res => {
      console.log(res.data);
    })
    .catch(err => console.log(err));
}
