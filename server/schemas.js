'use strict';

const Joi = require('joi');

const todoSchema = {
    content: Joi.string().error(new Error('No task specified.')),
    done: Joi.boolean(),
    id: Joi.string()
};


exports.todoObject = todoSchema;


exports.todoSchema = Joi.object().keys(todoSchema);
