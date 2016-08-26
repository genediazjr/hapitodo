'use strict';

const Joi = require('joi');
const Schema = require('../schemas');

const internals = {
    restapi: '/api/v1/todo',
    plugins: { errorh: false }
};


module.exports = [
    {
        path: `${internals.restapi}/list/{filter}`,
        method: 'get',
        handler: { todoBrowse: {} },
        config: {
            validate: { params: { filter: Joi.string().valid(['all', 'active', 'completed']) } },
            plugins: {
                errorh: false,
                crumb: { restful: false }
            }
        }
    },
    {
        path: `${internals.restapi}/{id}`,
        method: 'delete',
        handler: { todoRemove: {} },
        config: {
            validate: { params: { id: Schema.todoObject.id } },
            plugins: internals.plugins
        }
    },
    {
        path: internals.restapi,
        method: 'post',
        handler: { todoCreate: {} },
        config: {
            validate: { payload: Schema.todoSchema.requiredKeys('content') },
            plugins: internals.plugins
        }
    },
    {
        path: internals.restapi,
        method: 'put',
        handler: { todoUpdate: {} },
        config: {
            validate: { payload: Schema.todoSchema.requiredKeys('id') },
            plugins: internals.plugins
        }
    }
];
