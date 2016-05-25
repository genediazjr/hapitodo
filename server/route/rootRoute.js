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
        handler: {
            rootHandler: {
                type: 'notfound'
            }
        }
    },
    {
        path: '/',
        method: 'get',
        handler: {
            rootHandler: {
                type: 'index'
            }
        }
    }
];
