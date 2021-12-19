const express = require('express');
const cors = require('cors');

const app = express();
// const static = express.static(__dirname + '/public');

app.use(cors());

const configRoutes = require('./routes');

// app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

module.exports = app;