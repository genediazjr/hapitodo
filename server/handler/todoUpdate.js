'use strict';

const Boom = require('boom');


module.exports = () => {

    return (request, reply) => {

        const todo = request.server.methods.todoModel;

        return todo.set(request.payload, (err, isUpdated) => {

            if (err) {
                // add logging here

                return reply(Boom.badImplementation());
            }

            if (!isUpdated) {

                return reply(Boom.notFound('To Do does not exist.'));
            }

            return reply({success: 'To Do Updated.'}).code(200);
        });
    };
};
