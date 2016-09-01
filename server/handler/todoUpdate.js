'use strict';

const Boom = require('boom');


module.exports = function () {

    return function (request, reply) {

        const todo = request.server.methods.todoModel;

        return todo.set(request.payload, (err, isUpdated) => {

            if (err) {
                request.server.log(['error'], err);

                return reply(Boom.badImplementation());
            }

            if (!isUpdated) {

                return reply(Boom.notFound('To Do does not exist.'));
            }

            return reply({ success: 'To Do Updated.' }).code(200);
        });
    };
};
