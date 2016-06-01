'use strict';

const apiPrefix = require('../../config').get('/apiPrefix');
const apiVersion = 'v1';

module.exports = [
    {
        path: '/' + apiPrefix + '/' + apiVersion + '/todo/{id?}',
        method: ['get', 'delete'],
        handler: {
            todoV1RestHandler: {}
        },
        config: {
            plugins: {
                crumb: {
                    restful: true
                }
            }
        }
    },
    {
        path: '/' + apiPrefix + '/' + apiVersion + '/todo',
        method: ['post', 'put'],
        handler: {
            todoV1RestHandler: {}
        },
        config: {
            plugins: {
                crumb: {
                    restful: true
                }
            }
        }
    }
];
