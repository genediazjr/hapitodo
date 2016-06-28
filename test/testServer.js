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
            options: {
                errorFiles: {
                    404: '404.html',
                    default: '50x.html'
                },
                staticRoute: {
                    path: '/{path*}',
                    method: '*',
                    handler: {
                        directory: {
                            path: './',
                            index: true,
                            redirectToSlash: true
                        }
                    }
                }
            }
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
