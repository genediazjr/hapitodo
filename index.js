'use strict';

const Composer = require('./server/composer');

Composer((err, server) => {

    if (err) {
        throw err;
    }

    server.start((err) => {

        if (err) {
            throw err;
        }

        server.log([], `Server started at ${server.info.uri}`);
    });
});
