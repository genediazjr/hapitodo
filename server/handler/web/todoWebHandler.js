'use strict';

module.exports = () => {

    return (request, reply) => {

        if (request.method === 'get') {
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

                    const newValues = values || {};
                    newValues.messages = newValues.messages || [];

                    if (err) {
                        request.server.log(['error'], err);
                        newValues.messages.push({
                            type: 'fail',
                            code: err.code,
                            message: err.message
                        });
                    }

                    return reply.view(template, newValues);
                });
            });
        }

        if (request.method === 'post') {
            const event = request.server.methods.event;
            const query = request.server.methods.util.queryString;
            let type = (request.payload.methodFallback || '').toLowerCase();

            if (['create', 'update', 'remove'].indexOf(type) > -1) {

                type = 'todo' + type.charAt(0).toUpperCase() + type.slice(1);

                return event[type](request.payload, (err, redirect, values) => {

                    const newValues = values || {};
                    newValues.messages = newValues.messages || [];

                    if (err) {
                        request.server.log(['error'], err);
                        newValues.messages.push({
                            type: 'fail',
                            code: err.code,
                            message: err.message
                        });
                    }

                    return query.build(newValues, (err, queries) => {

                        if (err) {
                            request.server.log(['error'], err);
                        }

                        return reply.redirect(redirect + queries || '');
                    });
                });
            }

            return reply.file('error.html').code(405);
        }
    };
};
