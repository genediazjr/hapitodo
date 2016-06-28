'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Errorh = require('errorh');
const Vision = require('vision');
const Handlebars = require('handlebars');
const Manifest = require('../server/manifest');


module.exports = function () {

    const server = new Hapi.Server(Manifest.get('/server'));

    server.connection();

    server.register([
        Inert,
        Vision,
        {
            register: Errorh,
            options: Manifest.errorhOptions
        }
    ], (err) => {

        if (err) {
            throw err;
        }
    });

    server.views({
        path: 'static/mold',
        partialsPath: 'static/mold/parts',
        relativeTo: process.cwd(),
        engines: { mustache: Handlebars }
    });

    return server;
};
