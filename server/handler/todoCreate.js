'use strict';

const Boom = require('boom');
const todoSchema = require('../schemas').todoSchema;
const requireContent = todoSchema.requiredKeys('content');


module.exports = (route, options) => {

    return (request, reply) => {

        const response = { title: 'New To Do' };
        const isWeb = options.web;
        const todo = request.server.methods.todoModel;
        const payload = request.payload;
        const err = requireContent.validate(payload).error;

        if (isWeb) {

            return reply.view('todoItem', response);
        }

        if (err) {

            return reply(Boom.badRequest(err.message));
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
