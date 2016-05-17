'use strict';

module.exports = [
    {
        path: '/{path*}',
        method: 'get',
        handler: {
            directory: {
                path: './',
                index: true,
                redirectToSlash: true
            }
        }
    },
    {
        path: '/{path*}',
        method: '*',
        handler: (request, reply) => {

            return reply.file('404.html').code(404);
        }
    },
    {
        path: '/',
        method: 'get',
        handler: (request, reply) => {

            return reply.view('index', { title: 'Hapi To Do Demo' });
        }
    }
];
