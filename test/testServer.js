'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Errorh = require('errorh');
const Manifest = require('../server/manifest');


module.exports = function () {

    const server = new Hapi.Server(Manifest.get('/server'));

    server.connection();

    server.register([
        Inert,
        {
            register: Errorh,
            options: Manifest.errorhOptions
        }
    ], (err) => {

        if (err) {
            throw err;
        }
    });

    return server;
};
