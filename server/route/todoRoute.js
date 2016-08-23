'use strict';

const Joi = require('joi');
const todoSchema = require('../schemas').todoSchema;
const object = '/todo';
const restapi = '/api/v1' + object;
const plugins = { errorh: false };


module.exports = [
    {
        path: restapi + '/list/{filter}',
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
        path: restapi + '/{id}',
        method: 'delete',
        handler: { todoRemove: {} },
        config: {
            validate: { params: { id: Joi.string().min(5) } },
            plugins: plugins
        }
    },
    {
        path: restapi,
        method: 'post',
        handler: { todoCreate: {} },
        config: {
            validate: { payload: todoSchema.requiredKeys('content') },
            plugins: plugins
        }
    },
    {
        path: restapi,
        method: 'put',
        handler: { todoUpdate: {} },
        config: {
            validate: { payload: todoSchema.requiredKeys('id') },
            plugins: plugins
        }
    }
];
