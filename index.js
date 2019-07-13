const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const solver = require('./helpers/parseLayout');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public'));

/* serves main page */
app.get('/', function(req, res) {});

app.post('/words', function(req, res) {
  console.log('/words called');
  res.send(solver.findWords(req.body));
});

app.listen(port, function() {
  console.log('Listening on ' + port);
});
