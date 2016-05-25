'use strict';

module.exports = [
    {
        path: '/todo/{id?}',
        method: 'get',
        handler: {
            todoWebHandler: {}
        }
    },
    {
        path: '/todo/{id?}',
        method: 'post',
        handler: {
            todoWebHandler: {}
        }
    }
];
