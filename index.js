/* jshint -W064 */
'use strict';

const Composer = require('./server/composer');

Composer((err, server) => {

    if (err) {
        throw err;
    }

    server.ext('onPostHandler', (request, reply) => {

        const response = request.response;

        if (response.isBoom) {
            if (response.output.statusCode === 404) {

                return reply.file('404.html').code(404);
            }

            return reply.file('error.html').code(response.output.statusCode);
        }

        return reply.continue();
    });

    server.start((err) => {

        if (err) {
            throw err;
        }

        server.log([], 'Server started at ' + server.info.uri);
    });
});
