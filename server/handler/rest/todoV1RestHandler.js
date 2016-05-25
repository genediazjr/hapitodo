'use strict';

module.exports = () => {

    return (request, reply) => {

        if (['get', 'delete'].indexOf(request.method) > -1) {
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

        if (['post', 'put'].indexOf(request.method) > -1) {
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
    };
};
