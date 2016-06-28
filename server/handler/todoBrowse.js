'use strict';

const Boom = require('boom');


module.exports = (route, options) => {

    return (request, reply) => {

        const response = { title: 'To Do List' };
        const isWeb = options.web;
        const todo = request.server.methods.todoModel;

        return todo.row((err, list) => {

            response.list = list;

            if (err) {
                // add logging here

                if (isWeb) {

                    return reply.file('50x.html').code(500);
                }

                return reply(Boom.badImplementation());
            }

            if (isWeb) {

                return reply.view('todoList', response);
            }

            return reply(response);
        });
    };
};
