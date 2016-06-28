'use strict';

const Boom = require('boom');


module.exports = (route, options) => {

    return (request, reply) => {

        const response = { title: 'To Do Item' };
        const isWeb = options.web;
        const todo = request.server.methods.todoModel;
        const id = request.params.id;

        return todo.get(id, (err, todo) => {

            response.item = todo;

            if (err) {
                // add logging here

                if (isWeb) {

                    return reply.file('50x.html').code(500);
                }

                return reply(Boom.badImplementation());
            }

            if (!todo) {

                if (isWeb) {

                    return reply.file('404.html').code(404);
                }

                return reply(Boom.notFound('To Do does not exist.'));
            }

            if (isWeb) {

                return reply.view('todoItem', response);
            }

            return reply(response);
        });
    };
};
