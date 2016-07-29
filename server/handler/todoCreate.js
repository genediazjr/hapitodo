'use strict';

const Boom = require('boom');


module.exports = (route, options) => {

    return (request, reply) => {

        const response = { title: 'New To Do' };
        const isWeb = options.web;
        const todo = request.server.methods.todoModel;
        const payload = request.payload;

        if (isWeb) {

            return reply.view('todoItem', response);
        }

        return todo.add(payload, (err) => {

            if (err) {
                // add logging here

                return reply(Boom.badImplementation());
            }

            return reply({success: 'To Do saved.'}).code(200);
        });
    };
};
