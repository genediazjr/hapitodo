'use strict';

const Glue = require('glue');
const Manifest = require('./manifest');
const options = {};


module.exports = Glue.compose.bind(Glue, Manifest.get('/'), options);
