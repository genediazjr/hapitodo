'use strict';

const Boom = require('boom');


module.exports = () => {

    return (request, reply) => {

        const todo = request.server.methods.todoModel;

        return todo.del(request.params.id, (err, isDeleted) => {

            if (err) {
                request.server.log(['error'], err);

                return reply(Boom.badImplementation());
            }

            if (!isDeleted) {

                return reply(Boom.notFound('To Do does not exist.'));
            }

            return reply().code(204);
        });
    };
};
