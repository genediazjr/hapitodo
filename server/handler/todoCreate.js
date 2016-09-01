'use strict';

const Boom = require('boom');


module.exports = function () {

    return function (request, reply) {

        const todo = request.server.methods.todoModel;

        return todo.add(request.payload, (err, id) => {

            if (err) {
                request.server.log(['error'], err);

                return reply(Boom.badImplementation());
            }

            return reply({success: 'To Do saved.', id: id}).code(201);
        });
    };
};
