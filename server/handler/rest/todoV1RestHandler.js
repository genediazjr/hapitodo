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

                return reply(newValues);
            });
        }

        if (['post', 'put'].indexOf(request.method) > -1) {
            const event = request.server.methods.event;
            let type = 'todoCreate';

            if (request.method.toLowerCase() === 'put') {
                type = 'todoUpdate';
            }

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

                return reply(newValues);
            });
        }
    };
};
