'use strict';

const Boom = require('boom');


module.exports = () => {

    return (request, reply) => {

        const todo = request.server.methods.todoModel;

        return todo.add(request.payload, (err, id) => {

            if (err) {
                // add logging here

                return reply(Boom.badImplementation());
            }

            return reply({success: 'To Do saved.', id: id}).code(201);
        });
    };
};
