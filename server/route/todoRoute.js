'use strict';

const Joi = require('joi');
const todoSchema = require('../schemas').todoSchema;
const requireId = todoSchema.requiredKeys('id');
const requireContent = todoSchema.requiredKeys('content');
const object = '/todo';
const restapi = '/api/v1' + object;
const paramsId = { id: Joi.string().min(5) };
const plugins = { errorh: false };
const isWeb = { web: true };


module.exports = [
    {
        path: object,
        method: 'get',
        handler: { todoCreate: isWeb }
    },
    {
        path: object + '/list',
        method: 'get',
        handler: { todoBrowse: isWeb }
    },
    {
        path: object + '/{id}',
        method: 'get',
        handler: { todoObtain: isWeb },
        config: { validate: { params: paramsId } }
    },
    {
        path: restapi + '/list',
        method: 'get',
        handler: { todoBrowse: {} },
        config: { plugins: plugins }
    },
    {
        path: restapi + '/{id}',
        method: 'get',
        handler: { todoObtain: {} },
        config: {
            plugins: plugins,
            validate: { params: paramsId }
        }
    },
    {
        path: restapi + '/{id}',
        method: 'delete',
        handler: { todoRemove: {} },
        config: {
            plugins: plugins,
            validate: { params: paramsId }
        }
    },
    {
        path: restapi + '/{any*}',
        method: 'post',
        handler: { todoCreate: {} },
        config: {
            plugins: plugins,
            validate: { payload: requireContent }
        }
    },
    {
        path: restapi + '/{any*}',
        method: 'put',
        handler: { todoUpdate: {} },
        config: {
            plugins: plugins,
            validate: { payload: requireId }
        }
    }
];
