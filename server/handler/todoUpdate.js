'use strict';

const Boom = require('boom');
const todoSchema = require('../schemas').todoSchema;
const requireId = todoSchema.requiredKeys('id');


module.exports = () => {

    return (request, reply) => {

        const todo = request.server.methods.todoModel;
        const payload = request.payload;
        const err = requireId.validate(payload).error;

        if (err) {

            return reply(Boom.badRequest(err.message));
        }

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
