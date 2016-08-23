'use strict';

const Boom = require('boom');


module.exports = () => {

    return (request, reply) => {

        const todo = request.server.methods.todoModel;

        return todo.row(request.params.filter, (err, todos) => {

            if (err) {
                // add logging here

                return reply(Boom.badImplementation());
            }

            return reply(todos || {}).code(200).header('x-csrf-token', request.server.plugins.crumb.generate(request, reply));
        });
    };
};
