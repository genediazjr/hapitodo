'use strict';

const Joi = require('joi');

const internals = {
    todoSchema: {
        content: Joi.string().error(new Error('No task specified.')),
        done: Joi.boolean(),
        id: Joi.string()
    }
};


exports.todoObject = internals.todoSchema;


exports.todoSchema = Joi.object().keys(internals.todoSchema);
