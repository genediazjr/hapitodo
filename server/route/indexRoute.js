'use strict';


module.exports = [
    {
        path: '/',
        method: 'get',
        handler: (request, reply) => {

            return reply.file('index.html');
        }
    }
];
