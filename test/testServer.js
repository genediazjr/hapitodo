'use strict';

const Hapi = require('hapi');
const Crumb = require('crumb');
const Inert = require('inert');
const Scooter = require('scooter');
const Blankie = require('blankie');
const Errorh = require('errorh');
const Manifest = require('../server/manifest');


module.exports = function () {

    const server = new Hapi.Server(Manifest.get('/server'));

    server.connection();

    server.register([
        Inert,
        Scooter,
        Blankie,
        {
            register: Crumb,
            options: { restful: true }
        },
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
