'use strict';

const Boom = require('boom');


module.exports = () => {

    return (request, reply) => {

        const todo = request.server.methods.todoModel;
        const payload = request.payload;

        return todo.set(payload, (err, isUpdated) => {

            if (err) {
                // add logging here

                return reply(Boom.badImplementation());
            }

            if (!isUpdated) {

                return reply(Boom.notFound('To Do does not exist.'));
            }

            return reply({success: 'To Do updated.'}).code(200);
        });
    };
};
