const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
// const static = express.static(__dirname + '/public');

app.use(cors());

const configRoutes = require('./routes');

// app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'bash-theory/build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'bash-theory/build', 'index.html'));
});

configRoutes(app);

module.exports = app;