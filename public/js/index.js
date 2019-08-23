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
    // Insert a cell in the row at index
    let newCell = row.insertCell(index);
    newCell.appendChild(document.createTextNode(''));
    newCell.addEventListener('click', toggleSelected);
  }
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
      displayWords(res.data.words);
    })
    .catch(err => console.log(err));
}

function displayWords(wordsObject) {
  let lengths = Object.keys(wordsObject);

  // // create table
  // var table = document.createElement('table');

  // // create row for headers
  // var tr = table.insertRow(-1);
  // var tr2 = table.insertRow(-1);

  // // push headers into table
  // for (var i = 0; i < lengths.length; i++) {
  //   // TABLE HEADER.
  //   var th = document.createElement('th');
  //   th.innerHTML = lengths[i];
  //   tr.appendChild(th);
  //   var td = document.createElement('td');
  //   tr2.appendChild(td);
  //   td.innerHTMl = wordsObject[lengths[i]].join(' ');
  // }

  // document.body.appendChild(table);

  for (let i = 0; i < lengths.length; i++) {
    let para = document.createElement('p');
    para.innerHTML = lengths[i] + ': ' + wordsObject[lengths[i]].join(' ');
    document.body.appendChild(para);
  }
}
