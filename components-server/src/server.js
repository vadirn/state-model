const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('*', (req, res) => {
  fs.readFile(path.resolve(__dirname, '..', 'build/index.html'), 'utf8', (err, data) => {
    res.send(data);
  });
});

app.listen(8080, () => {
  console.log('Static server listening on port 8080!');
});
