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

let button1 = document.getElementById('myButton1');
let button2 = document.getElementById('myButton2');
let button3 = document.getElementById('myButton3');
let button4 = document.getElementById('myButton4');

button1.addEventListener('click', addRow.bind(null, 0));
button2.addEventListener('click', addColumn.bind(null, 0));
button3.addEventListener('click', addRow.bind(null, -1));
button4.addEventListener('click', addColumn.bind(null, -1));

function addRow(index) {
  // Get a reference to the table
  let tableRef = document.getElementById('my-table');

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
  let rowsRef = document.getElementById('my-table').getElementsByTagName('tr');

  for (let row of rowsRef) {
    let newCell = row.insertCell(index);
    newCell.appendChild(document.createTextNode(''));
    newCell.addEventListener('click', toggleSelected);
  }
  // Insert a cell in the row at index 0
}

function toggleSelected() {
  console.log('clicked');
  this.classList.toggle('active');
}
