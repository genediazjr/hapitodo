'use strict';

const Path = require('path');
const apiPrefix = require('../../config').get('/apiPrefix');
const apiVersion = 'v1';

module.exports = [
    {
        path: Path.join('/', apiPrefix, apiVersion, 'todo/{id?}'),
        config: { plugins: { crumb: { restful: true } } },
        method: ['get', 'delete'],
        handler: (request, reply) => {

            const event = request.server.methods.event;
            let type = 'todoBrowse';

            if (request.params.id) {
                type = 'todoObtain';
            }

            if (request.method.toLowerCase() === 'delete') {
                type = 'todoRemove';
            }

            return event[type](request.params, (err, template, values) => {

                values = values || {};
                values.messages = values.messages || [];

                if (err) {
                    request.server.log(['error'], err);
                    values.messages.push({
                        type: 'fail',
                        code: err.code,
                        message: err.message
                    });
                }

                return reply(values);
            });
        }
    },
    {
        path: Path.join('/', apiPrefix, apiVersion, 'todo'),
        config: { plugins: { crumb: { restful: true } } },
        method: ['post', 'put'],
        handler: (request, reply) => {

            const event = request.server.methods.event;
            let type = 'todoCreate';

            if (request.method.toLowerCase() === 'put') {
                type = 'todoUpdate';
            }

            return event[type](request.payload, (err, redirect, values) => {

                values = values || {};
                values.messages = values.messages || [];

                if (err) {
                    request.server.log(['error'], err);
                    values.messages.push({
                        type: 'fail',
                        code: err.code,
                        message: err.message
                    });
                }

                return reply(values);
            });
        }
    }
];
