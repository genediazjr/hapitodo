'use strict';

module.exports = (route, options) => {

    return (request, reply) => {

        if (options.type === 'notfound') {

            return reply.file('404.html').code(404);
        }

        if (options.type === 'index') {

            return reply.view('index', { title: 'Hapi To Do Demo' });
        }
    };
};
