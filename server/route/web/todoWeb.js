'use strict';

module.exports = [
    {
        path: '/todo/{id?}',
        method: 'get',
        handler: (request, reply) => {

            const event = request.server.methods.event;
            const query = request.server.methods.util.queryString;
            let type = 'todoObtain';

            if (request.params.id === 'list') {
                type = 'todoBrowse';
            }

            return query.parse(request.query, (err, queries) => {

                if (err) {
                    request.server.log(['error'], err);
                }

                request.params.query = queries || [];
                request.params.crumb = request.plugins.crumb;

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

                    return reply.view(template, values);
                });
            });
        }
    },
    {
        path: '/todo/{id?}',
        method: 'post',
        handler: (request, reply) => {

            const event = request.server.methods.event;
            const query = request.server.methods.util.queryString;
            let type = (request.payload.methodFallback || '').toLowerCase();

            if (['create', 'update', 'remove'].indexOf(type) > -1) {

                type = 'todo' + type.charAt(0).toUpperCase() + type.slice(1);

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

                    return query.build(values, (err, queries) => {

                        queries = queries || '';

                        if (err) {
                            request.server.log(['error'], err);
                            values.messages.push({
                                type: 'fail',
                                code: err.code,
                                message: err.message
                            });
                        }

                        return reply.redirect(redirect + queries);
                    });
                });
            }

            return reply.file('error.html').code(405);
        }
    }
];
