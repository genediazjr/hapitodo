'use strict';

const Glue = require('glue');
const Path = require('path');
const Manifest = require('./manifest');
const options = { relativeTo: Path.resolve(__dirname, '..', 'plugin') };

module.exports = Glue.compose.bind(Glue, Manifest.get('/'), options);
