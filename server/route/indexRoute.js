'use strict';


module.exports = [
    {
        path: '/',
        method: 'get',
        handler: function (request, reply) {

            return reply.file('index.html');
        }
    }
];
