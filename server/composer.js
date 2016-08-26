'use strict';

const Glue = require('glue');
const Manifest = require('./manifest');


module.exports = Glue.compose.bind(Glue, Manifest.get('/'), {});
