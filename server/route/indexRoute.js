'use strict';


module.exports = [
    {
        path: '/',
        method: 'get',
        handler: (request, reply) => {

            return reply.view('index', { title: 'Hapi To Do Demo' });
        }
    }
];
