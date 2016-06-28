'use strict';

const Joi = require('joi');


exports.todoSchema = Joi.object().keys({
    content: Joi.string().error(new Error('No task specified.')),
    done: Joi.boolean(),
    id: Joi.string()
});
