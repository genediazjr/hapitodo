'use strict';

const Boom = require('boom');


module.exports = () => {

    return (request, reply) => {

        const todo = request.server.methods.todoModel;
        const id = request.params.id;

        return todo.del(id, (err, isDeleted) => {

            if (err) {
                // add logging here

                return reply(Boom.badImplementation());
            }

            if (!isDeleted) {

                return reply(Boom.notFound('To Do does not exist.'));
            }

            return reply({success: 'To Do deleted.'}).code(200);
        });
    };
};
